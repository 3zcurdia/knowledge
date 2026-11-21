# Group email dispatch via EmailConstructor and SystemMailer

Callers enqueue only an email name plus args from state machines and observers; a catalog object resolves recipients and options, a generic mailer delivers, and customer buckets decide which inbox gets what.

**Project**: internal-app · **Stack**: ruby/rails, actionmailer, activejob · **Where**: `lib/email_constructor.rb:16`, `app/jobs/system_mailer_job.rb:1`, `app/mailers/system_mailer.rb:14`, `app/models/merchant_notification_config.rb:53`, `lib/emails_catalog.rb:10`

## Code

```ruby
# lib/email_constructor.rb
  def send_email
    load_variables
    @recipients.each do |recipient|
      next if recipient_disabled?(recipient)
      next unless bucket_enabled?(recipient, @extra_variables[:group_purchase])
      set_locale(recipient)

      if recipient.is_a?(Merchant)
        @extra_variables[:hide_notification_preferences] = true
      end

      load_variables
      SystemMailer.default_email(@email_name, recipient, @options, @extra_variables).deliver_now
    end
  end
```

```ruby
# app/jobs/system_mailer_job.rb
class SystemMailerJob < ActiveJob::Base
  include DefaultJobOptions
  queue_as :mailers

  def perform(email_name, *args)
    EmailConstructor.new(email_name.to_sym, *args).send_email
  end
end
```

```ruby
# app/mailers/system_mailer.rb
  def default_email(email_name, recipient, options, extra_variables = {})
    @recipient = recipient
    to = if @recipient.is_a? Customer
      @recipient.notification_config.recipients_for(email_name)
    elsif @recipient.respond_to? :email_with_name
      @recipient.email_with_name
    elsif @recipient.is_a?(String) && @recipient =~ /(?:"?([^"]*)"?\s)?(?:<?([_a-z0-9-]+(?:\.[_a-z0-9-]+)*@[a-z0-9-]+(?:\.[a-z0-9-]+)*(?:\.[a-z]{2,4}))>?)$/
      @recipient
    else
      nil
    end

    extra_variables[:group_purchase] ||= @recipient.group_purchase if @recipient.respond_to?(:group_purchase)

    if to.present?
      extra_variables.each { |k,v| instance_variable_set "@#{k}", v } if extra_variables.present?
      @customer ||= @group_purchase.try(:customer)
      options.merge! template_name: email_name, to: to
      mail(options)
    end
  end
```

```ruby
# app/models/merchant_notification_config.rb
  def recipients_for(email)
    if bucket(email) == 'receipts'
      payments_and_billing_emails
    else
      basic_emails
    end
  end
```

```ruby
# lib/emails_catalog.rb
  # Email to customer when a GP is created
  def purch_created_merch_notice(group_purchase)
    @recipients = [group_purchase.customer]
    @options = {
      subject: I18n.t('system_mailer.purch_created_merch_notice.subject',
                      group_purchase_name: group_purchase.name)
    }
  end
```

## Why it matters

- One generic `default_email` serves ~100 transactional emails via `template_name: email_name`; adding an email means adding one catalog method, not one mailer method.
- Recipient filtering (`recipient_disabled?`, `bucket_enabled?`) happens before delivery, so group-purchase state callbacks in `Membership::States` and `GroupPurchase::States` stay one-liners like `SystemMailerJob.perform_later(:inv_claim_spot, self)`.
- Customer recipients resolve through `CustomerNotificationConfig` buckets (`receipts` vs `basic_emails`), letting each customer split billing mail from lifecycle mail without code changes.
- Copy this when many domain events each need their own recipients/subject but share delivery, locale, tracking, and error handling; avoid it when you have under a handful of emails — the indirection is not worth it.

## See also

- [Per-client embed snippet with loader and iframe checkout](client-embed-snippet-loader.md)

> Source: inbox/code/internal-app · processed 2026-11-20
