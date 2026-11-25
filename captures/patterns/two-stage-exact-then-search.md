# Two-stage exact-then-fulltext search with success flag

Tries a cheap exact match first and only falls back to full-text search on a miss, exposing whether anything matched. Worth keeping as a latency-saving search shape.

**Project**: internal-app · **Stack**: ruby/rails · **Where**: `app/queries/search_items_query.rb`

## Code
```ruby
# frozen_string_literal: true

class SearchItemsQuery < ActionQuery
  attr_reader :terms

  def initialize(scope: Item, params: {})
    @initial_scope = scope.includes(:manufacturer, :item_category, :recalls,
                                    documents: { file_attachment: :blob })
                          .where.not(item_category: ItemCategory.find_by(name: "part"))
    @params = params
    @terms = params[:terms]
    @successful = false
  end

  def call
    initial_scope
      .then(&method(:search))
  end

  def successful?
    @successful
  end

  private

  attr_reader :initial_scope, :params

  def search(scope)
    return scope.none if terms.blank?

    results = scope.where(model: terms)
    if results.exists?
      @successful = true
      return results
    end

    results = scope.full_text_search(terms)
    @successful = true if results.exists?
    results
  end
end
```

## Why it matters
- Exact `where` plus `exists?` short-circuits the expensive `pg_search` path on the common hit, saving a full-text query per exact lookup.
- `successful?` flag lets controllers decide between results, empty-state, or suggestion UI without re-querying.
- `scope.none` on blank terms avoids accidental full-table scans from empty input.

> Source: inbox/code/internal-app/app/queries/search_items_query.rb · processed 2026-11-23
