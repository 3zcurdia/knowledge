# STI rule engine with conditions_meet predicate

Base record defines a predicate contract; each subclass stores its own parameters and implements the match. Worth keeping as a minimal extensible rule-engine without conditionals.

**Project**: internal-app · **Stack**: ruby/rails · **Where**: `app/models/recall_rule.rb`, `app/models/recall_rules/match_serial.rb`, `app/models/recall_rules/range_serial.rb`

## Code
```ruby
# frozen_string_literal: true

class RecallRule < ApplicationRecord
  belongs_to :recall

  validates :parameters, presence: true

  def conditions_meet?(_property_item)
    raise NotImplementedError, "You must implement #{self.class}##{__method__}"
  end
end
```

```ruby
# frozen_string_literal: true

module RecallRules
  class MatchSerial < RecallRule
    store_accessor :parameters, [:serial]
    validates :serial, presence: true

    normalizes :serial, with: ->(serial) { serial.upcase.strip }

    def conditions_meet?(property_item)
      property_item.serial == serial
    end
  end
end
```

```ruby
# frozen_string_literal: true

module RecallRules
  class RangeSerial < RecallRule
    store_accessor :parameters, %i[from_serial to_serial]
    validates :from_serial, :to_serial, presence: true

    normalizes :from_serial, with: ->(serial) { serial.upcase.strip }
    normalizes :to_serial, with: ->(serial) { serial.upcase.strip }

    def conditions_meet?(property_item)
      range.cover?(property_item.serial)
    end

    private

    def range
      @range ||= from_serial..to_serial
    end
  end
end
```

## Why it matters
- STI plus `store_accessor` gives schemaless per-rule params with validations and `normalizes` normalization in one place.
- Callers iterate rules and call one predicate — adding a match type means adding a subclass, never editing a case statement.
- Range built once and memoized shows the performance habit for hot predicates.

> Source: inbox/code/internal-app/app/models/recall_rule.rb · processed 2026-11-23
