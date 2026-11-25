# Parallel similarity fan-out with load_async

Splits candidate strings into parallel ActiveRecord similarity queries and merges results in Ruby. Worth keeping as a minimal parallel fan-out for search endpoints.

**Project**: internal-app · **Stack**: ruby/rails · **Where**: `app/queries/api/items_similarity_query.rb`

## Code
```ruby
# frozen_string_literal: true

module Api
  class ItemsSimilarityQuery < ActionQuery
    def initialize(scope: Item, params: {})
      @initial_scope = scope.includes(:manufacturer, :item_category, :recalls)
      @params = params
    end

    def call
      initial_scope
        .then(&method(:search))
    end

    private

    attr_reader :initial_scope, :params

    def search(scope)
      if params[:model].present?
        search_by_model(scope)
      elsif params[:candidates].present?
        search_by_candidates(scope)
      else
        raise ActionController::ParameterMissing, "model or candidates"
      end
    end

    def search_by_model(scope)
      scope.similar_model(params[:model]).limit(10)
    end

    def search_by_candidates(scope)
      params[:candidates]
        .split(",")
        .reject { |c| c.size <= 4 }
        .flat_map { scope.similar_model(_1).load_async.limit(10) }
        .compact
        .uniq
        .sort_by { |a, b| a&.confidence.to_f <=> b&.confidence.to_f }
    end
  end
end
```

## Why it matters
- `load_async` inside `flat_map` fires one query per candidate concurrently on the same pool — no threads, no jobs, just the Rails 7 async executor.
- `reject short tokens` plus `compact/uniq/sort_by confidence` moves ranking to Ruby, keeping SQL simple and composable via `ActionQuery.then`.
- Copyable when an endpoint accepts a comma list and must return top-N merged matches with bounded per-branch limits.

> Source: inbox/code/internal-app/app/queries/api/items_similarity_query.rb · processed 2026-11-23
