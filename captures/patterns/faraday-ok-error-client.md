# Minimal Faraday client returning ok/error tuples

One memoized JSON connection with uniform success/error hashes and content-aware error extraction. Worth keeping as the smallest copyable third-party API wrapper.

**Project**: internal-app · **Stack**: ruby/faraday · **Where**: `app/services/hubspot/api.rb`

## Code
```ruby
# frozen_string_literal: true

module Hubspot
  class Api
    def get(path, **query_params)
      Rails.logger.debug { "[HUBSPOT GET] #{path}" }
      response = conn.get(path, query_params) do |req|
        req.headers["Authorization"] = "Bearer #{api_key}"
      end

      result = handle_response(response)
      result["results"] || result
    end

    def post(path, payload)
      Rails.logger.debug { "[HUBSPOT POST] #{path}" }
      response = conn.post(path) do |req|
        req.headers["Authorization"] = "Bearer #{api_key}"
        req.body = payload.to_json
      end

      handle_response(response)
    end

    private

    def handle_response(response)
      if response.success?
        { ok: response.body }
      elsif response.headers["content-type"].include?("json")
        { error: { status: response.status, message: response.body["message"] } }
      else
        { error: { status: response.status, message: response.body } }
      end
    end

    def conn
      @conn ||= Faraday.new(url: "https://api.hubapi.com/") do |faraday|
        faraday.request :json
        faraday.response :json
      end
    end

    def api_key
      Rails.application.credentials.hubspot[:api_key]
    end
  end
end
```

## Why it matters
- `{ok:} / {error:}` tuples force callers to branch explicitly instead of rescuing exceptions for control flow.
- Content-type check avoids JSON-key errors on HTML/plain error pages from providers.
- Memoized `Faraday.new` with `:json` middleware keeps every endpoint to a 5-line method.

> Source: inbox/code/internal-app/app/services/hubspot/api.rb · processed 2026-11-23
