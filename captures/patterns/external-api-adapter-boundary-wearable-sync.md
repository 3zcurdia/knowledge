# External API adapter boundary for wearable sync

All vendor OAuth, token, and time-series quirks live in one adapter object; workers and controllers only call `sync_account!`, `load_data*!`, and subscription methods, so swapping vendors touches one file.

**Project**: internal-app · **Stack**: ruby/rails, oauth2, fitbit_client · **Where**: `app/models/device_adapter/fitbit.rb:4`

## Code

```ruby
# app/models/device_adapter/fitbit.rb
def sync_account!(fitbit_user_id, token, refresh_token, expires_at)
  ActiveRecord::Base.transaction do
    # CREATE OR UPDATE the user device
    UserDevice.where(user_id: @user.id, device: Device.fitbit_activity_monitor.first).first_or_create!

    # CREATE OR UPDATE the user linked account
    linked_account = create_or_update_user_linked_account!(fitbit_user_id)

    # CREATE OR UPDATE the OAuth2 Account
    create_or_update_oauth2_account!(linked_account, refresh_token, token, expires_at)

    # Invalidate cached account
    @account = nil
    true
  end
rescue => e
  Rails.logger.error "[DeviceAdapter::Fitbit#sync_account Error] #{e.message}"
  false
end
```

```ruby
# app/models/device_adapter/fitbit.rb
def load_data!
  # Fix due fitbit api is broken!
  # load_data_for_sleep_by_range!(Date.current - 7.days, Date.current)
  current_date = Date.current
  ((current_date - 7.days)..current_date).each do |date|
    load_data_sleep!(date)
  end

  DeviceActivity.load_data!(user) { |resource| client.activity_time_series(resource, current_date, '7d') }
end
```

```ruby
# app/models/device_adapter/fitbit.rb
def load_data_sleep!(date_or_range)
  if date_or_range.is_a?(Date)
    DeviceSleep.load_data!(user.id, date_or_range) { client.sleep_logs_by_date(date_or_range) }
  else
    DeviceSleep.load_data!(user.id, date_or_range) { client.sleep_logs_by_date_range(date_or_range.begin, date_or_range.end) }
  end
end
```

```ruby
# app/models/device_adapter/fitbit.rb
def load_data_weight!(date = nil)
  if date
    DeviceWeight.load_data!(user.id, date) { client.weight_logs(date) }
  else # Fetch for 8 days
    DeviceWeight.load_data!(user.id, default_date_range) { client.weight_logs(default_date_range.end, '7d') }
  end
end
```

```ruby
# app/models/device_adapter/fitbit.rb
def subscribed?(type)
  subscription = retrieve_subscription(type)
  subscription && subscription.dig('apiSubscriptions', 0, 'subscriptionId') == subscription_id(type)
end

def create_subscription(type)
  client.add_subscription(type, subscription_id(type))
end

def retrieve_subscription(type)
  client.list_of_subscriptions(type)
end

def remove_subscription(type)
  client.delete_subscription(type, subscription_id(type))
end
```

```ruby
# app/models/device_adapter/fitbit.rb
def subscription_id(type)
  "#{@user.id}#{type}"
end
```

## Why it matters

- One seam (`sync/load/subscribed?/create/remove_subscription`) hides OAuth2 account rows, `first_or_create!` device rows, per-day versus per-range vendor calls, and the broken-range-endpoint workaround.
- `subscription_id` embeds the local user id (`"#{user.id}#{type}"`) so inbound webhook rows route back without a lookup table; `user_id_from_subscription_id` parses it back with a leading-digits regex.
- Transactional `sync_account!` returns boolean and logs instead of raising, so OAuth callbacks stay thin; callers that need strictness should check the return value.
- Copy when integrating any per-user OAuth vendor with webhooks; avoid stuffing `client.*` calls directly into workers — the vendor's broken-range workaround would then leak everywhere.

## See also

- [Idempotent wearable ingest with row lock and upsert](idempotent-wearable-ingest-row-lock-upsert.md)
- [HMAC webhook verification with durable notification inbox](hmac-webhook-durable-inbox.md)

> Source: inbox/code/internal-app · processed 2026-11-23
