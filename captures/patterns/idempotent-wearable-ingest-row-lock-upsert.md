# Idempotent wearable ingest with row lock and upsert

Sidekiq retries and duplicate webhook deliveries make wearable time-series ingest run twice; this pair takes a row lock on the device row, memos existing day rows, then upserts each day so replays converge instead of duplicating.

**Project**: internal-app · **Stack**: ruby/rails, activerecord, sidekiq · **Where**: `app/models/concerns/device_utils.rb:8`, `app/models/concerns/device_data_loading.rb:42`

## Code

```ruby
# app/models/concerns/device_utils.rb
def safe_load!(user_id, date_or_range, parsed_response)
  date_or_range = date_or_range.is_a?(Date) ? (date_or_range..date_or_range) : date_or_range
  transaction do
    UserDevice.where(user_id: user_id, device: Device.fitbit_activity_monitor.limit(1)).lock.first
    records = where(user_id: user_id, day: date_or_range).each_with_object({}) { |entry, memo| memo[entry.day] = entry }
    date_or_range.each do |date|
      record = records[date] || new(user_id: user_id, day: date)
      record.sync!(parsed_response[date])
    end
  end
end
```

```ruby
# app/models/concerns/device_data_loading.rb
def load_data!(user, &request)
  resource_names.each do |resource|
    exec_request!(user, resource, request)
  end
end
```

```ruby
# app/models/concerns/device_data_loading.rb
def exec_request!(user, resource, request)
  response = request.call(resource)
  update_series_for_user(user, response)
rescue FitbitClient::Error => e
  # Skip the current resource if the endpoint returns 400 due the user
  # device does not log data for the requested resource type
  if e.response.status == 400
    json_response = JSON.parse(e.response.body)
    return if json_response.dig('errors', 0, 'errorType') == 'validation' &&
              json_response.dig('errors', 0, 'fieldName') == 'resource path'
  end
  raise(e)
end
```

## Why it matters

- `lock.first` on the `UserDevice` row serializes concurrent pulls and webhook deliveries per user so two workers cannot interleave day-row creates.
- Preloading `where(day: range)` into a hash turns N-day backfills into one SELECT plus in-memory lookup instead of N `find_or_create` round trips.
- `records[date] || new(...)` plus `sync!` makes every replay an upsert: safe under Sidekiq retries and duplicate webhook deliveries.
- `exec_request!` swallows only the vendor's known 400 `validation/resource path` (device never logs that resource) and re-raises everything else — selective tolerance instead of blanket rescue.
- Copy when ingesting third-party time series per user per day; skip the lock when a unique index on `(user_id, day)` plus `upsert_all` already gives you the guarantee.

## See also

- [External API adapter boundary for wearable sync](external-api-adapter-boundary-wearable-sync.md)
- [HMAC webhook verification with durable notification inbox](hmac-webhook-durable-inbox.md)

> Source: inbox/code/internal-app · processed 2026-11-23
