# Gamified nutrition and workout scoring rules engine

Daily scores are derived, not entered: meal logs pass a four-gate check (exactly two logs, each under the per-meal cap, day total inside ±50 of target, macro percentages balanced) and workouts map to cardio, strength, or rest buckets, all upserted into one row per user per day.

**Project**: internal-app · **Stack**: ruby/rails, activerecord, bigdecimal · **Where**: `app/models/score.rb:90`, `app/models/macro_balance_calculator.rb:35`, `app/models/count.rb:121`

## Code

```ruby
# app/models/score.rb
def self.do_score(log, user)
  if log.loggable_type == "Recipe"
    case log.properties['circumstance'].to_i
    when 1, 2
      nutrition_score(user, :morning, log)
    when 3, 4
      nutrition_score(user, :afternoon, log)
    else
      nutrition_score(user, :evening, log)
    end
  elsif log.loggable_type == 'Exercise'
    workout_score(user, log)
  else
    Rails.logger.error "[ERROR::Score#do_score] : invalid loggable type : #{log.loggable_type.inspect}"
    false
  end
end
```

```ruby
# app/models/score.rb
def self.nutrition_score(user, time, log)
  circumstance = Recipe.time_period_to_circumstance(time)
  current_logs_recipes = Log.recipes_for_score(user.id, log.day, circumstance)

  # Should be 2 meals to archive the score
  return record_score(user, log.day, time, 0) unless current_logs_recipes.count == 2

  # Validate than the calories are lower than 550
  if Recipe.where(id: current_logs_recipes.select(:loggable_id)).where('calories >= ?', MAX_CALORIES_PER_MEAL).exists?
    return record_score(user, log.day, time, 0)
  end

  # The following operations takes into account all the logs for the
  # specified user, day and period of time
  total_calories = Count.new(user).current_b_calories_all_meals(time, log.day)
  macro_details = user.get_tracked_macros(log.day, circumstance)
  macros_balanced = MacroBalanceCalculator.balanced?(macro_details['percent_total_fat'], macro_details['percent_carbs'], macro_details['percent_protein'])

  record_score(user, log.day, time, (-50..50).cover?(total_calories) && macros_balanced ? 1 : 0)
end
```

```ruby
# app/models/score.rb
def self.record_score(user, date, type = nil, value = nil)
  score = Score.find_or_initialize_by(user_id: user.id, day: date) do |scr|
    scr.user_id = user.id
    scr.team_id = user.team_id
    scr.coach_id = user.team.coach.id
    scr.zipcode = user.info.zip_code
    scr.day = date
  end
  score.assign_attributes({ type => value }) if type && value
  score.save
end
```

```ruby
# app/models/macro_balance_calculator.rb
def self.balanced?(percent_calories_fats, percent_calories_carbs, percent_calories_proteins)
  (0.10..0.30).cover?(percent_calories_fats) &&
    (0.35..0.55).cover?(percent_calories_carbs) &&
    (0.25..0.45).cover?(percent_calories_proteins)
end
```

```ruby
# app/models/macro_balance_calculator.rb
def self.b_calories(fats, carbs, proteins)
  return 0 if fats.zero? && carbs.zero? && proteins.zero?
  calories = raw_calories(fats, carbs, proteins)
  percent_of_calories = percentage_of_calories(calories[:fat], calories[:carb], calories[:protein])
  if balanced?(percent_of_calories[:fat], percent_of_calories[:carb], percent_of_calories[:protein])
    format_b_calories(calories[:total])
  else
    0
  end
end
```

```ruby
# app/models/count.rb
def current_b_calories_all_meals(time, date)
  target_b_calories(time) - spent_b_calories_all_meals(time, date)
end
```

## Why it matters

- Four gates in order of cheapness (count, then per-meal cap via `EXISTS`, then target band, then macro balance) so the common fail-fast path never computes macros.
- `find_or_initialize_by(user_id:, day:)` plus `assign_attributes({type => value})` keeps exactly one score row per user per day; re-logging re-derives instead of double-counting.
- `MacroBalanceCalculator` is a pure `BigDecimal` module (9/4/4 kcal per gram) separate from the older float `MacroBalance` mixin — testable math versus model plumbing.
- The weekly team leaderboard drops to raw SQL summing `cardio+strength+morning+afternoon+evening` per team; it is marked `#TODO clean up` — fast but brittle if columns change.
- Copy the gate-then-upsert shape for any derived daily score; do not copy the circumstance magic numbers (`1..6`) without the `Recipe.time_period_to_circumstance` map beside them.

## See also

- [Idempotent wearable ingest with row lock and upsert](idempotent-wearable-ingest-row-lock-upsert.md)

> Source: inbox/code/internal-app · processed 2026-11-23
