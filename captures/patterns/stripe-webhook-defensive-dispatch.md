# Defensive webhook parsing with type dispatch

Wraps raw webhook payloads so malformed JSON never raises, normalizing the event type to a dispatchable symbol. Worth keeping as a crash-proof ingress seam.

**Project**: internal-app · **Stack**: ruby/rails · **Where**: `app/services/stripe_payments/webhook_event.rb`

## Code
```ruby
# frozen_string_literal: true

module StripePayments
  class WebhookEvent
    def initialize(payload)
      @payload = payload
    end

    def type
      @type ||= event.type.to_s.parameterize.underscore.to_sym if event.respond_to?(:type)
    end

    def id
      @id ||= object.try(:id)
    end

    def customer_id
      @customer_id ||= object.try(:customer)
    end

    protected

    def event
      @event ||= build_event
    end

    def object
      @object ||= event.try(:data).try(:object)
    end

    def build_event
      Stripe::Event.construct_from(safe_parse(@payload))
    end

    private

    def safe_parse(payload)
      return payload if payload.is_a?(Hash)

      JSON.parse(payload)
    rescue JSON::ParserError
      Stripe::Event.construct_from({})
    end
  end
end
```

## Why it matters
- `construct_from` plus `safe_parse` accepts Hash or JSON string and degrades to an empty event instead of raising — webhooks stay 200-OK on garbage input.
- `parameterize.underscore.to_sym` turns dotted vendor types into stable Ruby dispatch keys for handler lookup.
- `try` chains on `data.object` isolate callers from missing-shape payloads.

> Source: inbox/code/internal-app/app/services/stripe_payments/webhook_event.rb · processed 2026-11-23
