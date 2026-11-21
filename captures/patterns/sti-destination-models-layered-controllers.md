# STI destination models with shared gateway mixin and layered controllers

`PaymentDestination` is an STI base declaring the abstract transfer interface while subclasses plug in gateway behavior; controllers use the same layering idea, with a namespace base adding customer scoping and the embed snippet controllers opting out of the app stack entirely.

**Project**: internal-app · **Stack**: ruby/rails, activerecord-sti, balanced/spreedly · **Where**: `app/models/payment_destination.rb:27`, `app/models/balanced_card.rb:2`, `app/models/balanced_bank_account.rb:5`, `app/models/spreedly_gateway.rb:9`, `app/models/balanced_methods.rb:4`, `app/models/bogus_payment_destination.rb:1`, `app/controllers/merchants/base_controller.rb:1`, `app/controllers/snippet/v3/snippets_controller.rb:1`

## Code

```ruby
# app/models/payment_destination.rb
  def self.new(*args, &block)
    if (attributes = args.first).is_a? Hash
      attributes[:type] = 'BalancedCard' if attributes[:type] == 'card'
      attributes[:type] = 'BalancedBankAccount' if attributes[:type] == 'bank_account'
      attributes[:type] = 'Gateway' if attributes[:type] == 'gateway'
    end
    super(*args, &block)
  end
```

```ruby
# app/models/payment_destination.rb
  def send_funds(purchase, amount)
    raise NotImplementedError
  end

  def screen_name
    raise NotImplementedError
  end

  def remove_from_service
    raise NotImplementedError
  end

  def can_be_destroyed?
    raise NotImplementedError
  end
```

```ruby
# app/models/balanced_card.rb
module Pay
  class BalancedCard < PaymentDestination
    include BalancedMethods

    MAX_PAYOUT_AMOUNT = Money.new(2500_00, :usd)
```

```ruby
# app/models/balanced_bank_account.rb
    MAX_PAYOUT_AMOUNT = Money.new(15000_00, :usd)
```

```ruby
# app/models/spreedly_gateway.rb
    alias_attribute :screen_name, :name
```

```ruby
# app/models/balanced_methods.rb
    def self.included(base)
      base.class_eval {
        alias_attribute :resource_uri, :remote_id
        alias_attribute :screen_name, :name
        attr_accessor :resource_fields

        before_validation :create_on_balanced, if: :new_record?
      }

      base.send :include, InstanceMethods
      base.send :extend, ClassMethods
    end
```

```ruby
# app/models/bogus_payment_destination.rb
class BogusPaymentDestination < PaymentDestination
  def send_funds(group_purchase, amount, details)
    Transaction.record(group_purchase.organizer, :PAY_OUT, amount: amount, details: details)
  end

  def remote_id
    object_id
  end
end
```

```ruby
# app/controllers/merchants/base_controller.rb
class Merchants::BaseController < ApplicationController
  layout 'merchant'
  before_action :set_merchant
  before_action :authorize_merchant
  before_action :activate_pricing_plan
  before_action :get_action_required_merchants_count, only: [:index]

  protected

  def set_merchant
    @merchant = Merchant.friendly.find(params[:merchant_id]) if params[:merchant_id]
    gon.merchant_name = @merchant.display_name
  end

  def authorize_merchant
    authorize! :operate, @merchant
  end
end
```

```ruby
# app/controllers/snippets_controller.rb
class SnippetsController < ActionController::Base
  before_action :find_merchant
  after_action :set_cache_control_headers, only: [:loader, :embed]
```

## Why it matters

- STI plus short-name coercion in `self.new` lets callers pass `type: 'card'` while the `type` column stores the class; `type_to_human` reverses the mapping for display.
- The base class owns only the contract (`send_funds`, `screen_name`, `remove_from_service`, `can_be_destroyed?`) and per-class caps (`MAX_PAYOUT_AMOUNT`: 2500 USD card vs 15000 USD bank account), so adding a destination rail is one subclass.
- `BalancedMethods.self.included` injects aliases, the `create_on_balanced` validation hook, and `send_funds!`/`reverse!` once for both Balanced subclasses instead of duplicating gateway code.
- `BogusPaymentDestination` shows the intended seam: swap the subclass in test without touching callers (note its `send_funds` takes 3 args vs the base 2 — a smell to align before copying).
- Controller layering mirrors the model layering: `Customers::BaseController` adds layout plus `set_customer`/`authorize_customer` once for every `Customers::*` controller; `Snippet::*` inherits `ActionController::Base` directly to dodge app-wide locale/mixpanel/auth filters on embed JS responses.

## See also

- [Group email dispatch via EmailConstructor and SystemMailer](group-email-dispatch.md)
- [Per-client embed snippet with loader and iframe checkout](client-embed-snippet-loader.md)

> Source: inbox/code/internal-app · processed 2026-11-20
