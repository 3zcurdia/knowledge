# HMAC webhook verification with durable notification inbox

Vendor subscription callbacks first prove themselves (verify-challenge plus HMAC-SHA1 over the raw JSON), then the raw payload is stored as one row and fanned out into per-event rows so async workers can retry without asking the vendor to resend.

**Project**: internal-app · **Stack**: ruby/rails, sidekiq, openssl · **Where**: `app/controllers/user_devices_controller.rb:24`, `app/models/fitbit_notification.rb:20`

## Code

```ruby
# app/controllers/user_devices_controller.rb
def subscription
  authorize UserDevice
  if params.keys.include?('verify')
    respond_to_verification
  elsif valid_fitbit_signature?
    FitbitNotification.create(json: params['_json'].to_json)
    head :no_content
  else
    log_unexpected_request
    head :not_found
  end
end
```

```ruby
# app/controllers/user_devices_controller.rb
def valid_fitbit_signature?
  return true if Rails.application.secrets.fitbit_disable_subs_signature_check
  sha1 = OpenSSL::Digest.new('sha1')
  hmac = OpenSSL::HMAC.digest(sha1, "#{ENV['FITBIT_CLIENT_SECRET']}&", params['_json'].to_json)
  request.headers['HTTP_X_FITBIT_SIGNATURE'] == Base64.strict_encode64(hmac)
end
```

```ruby
# app/controllers/user_devices_controller.rb
def respond_to_verification
  status = if params['verify'] == ENV['FITBIT_VERIFICATION_KEY']
             :no_content
           else
             :not_found
           end
  head status
end
```

```ruby
# app/models/fitbit_notification.rb
def create_requests
  json_parsed = JSON.parse(json)
  json_parsed.each do |notification|
    fitbit_requests.create(collection_type: notification['collectionType'],
                           date: notification['date'],
                           subscription_id: notification['subscriptionId'],
                           owner_id: notification['ownerId'],
                           owner_type: notification['ownerType'],
                           status: 'new')
  end
end
```

## Why it matters

- HMAC is computed over `params['_json'].to_json` with key `"#{SECRET}&"` and compared to the `X-FITBIT-SIGNATURE` header — verification happens before any DB write, so forged callbacks cost almost nothing.
- The verify-challenge branch answers `204` only when the shared verification key matches, otherwise `404`, leaking nothing about which half failed.
- Storing the raw `json` first preserves the vendor payload verbatim for replay and debug; `after_create :create_requests` fans out one row per event with `status: 'new'` so workers claim rows instead of re-parsing.
- `skip_before_action` for authenticity token and authentication is scoped to the `subscription` action only — the rest of the controller stays behind auth.
- Copy for any HMAC-signed webhook with bursty deliveries; add a unique index on the vendor event id if the vendor retries aggressively (here dedupe relies on the downstream upsert).

## See also

- [External API adapter boundary for wearable sync](external-api-adapter-boundary-wearable-sync.md)
- [Idempotent wearable ingest with row lock and upsert](idempotent-wearable-ingest-row-lock-upsert.md)

> Source: inbox/code/internal-app · processed 2026-11-23
