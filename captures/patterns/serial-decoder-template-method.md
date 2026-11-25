# Serial-number decoder family via template-method + named captures

Base decoder defines the parsing contract and date logic; each vendor subclass supplies one regex with named captures plus lookup tables. Worth keeping as a compact family-of-parsers pattern.

**Project**: internal-app · **Stack**: ruby/rails · **Where**: `app/decoders/active_decoder.rb`, `app/decoders/ge_decoder.rb`

## Code
```ruby
# frozen_string_literal: true

# Decode a serial number
class ActiveDecoder
  def self.decode(serial_number)
    new(serial_number).data
  end

  def self.decode_manufacture_date(serial_number)
    new(serial_number).manufacture_date
  end

  def initialize(serial_number)
    @serial_number = serial_number
  end

  def manufacture_date
    return unless valid?

    years.filter_map do |year|
      date = Date.new(year.to_i, Date::ABBR_MONTHNAMES.index(month), 1)
      "#{month}/#{year}" if date < Time.zone.today
    end.join(" ").upcase
  end

  def week = serial_data["week"].to_i

  def data
    @data ||= {
      years: years,
      month: month
    }
  end

  def valid?
    serial_data.present? && years.present? && month.present?
  end

  protected

  def estimate_month_from_week
    Date::ABBR_MONTHNAMES[(Date.new(years.first.to_i, 1, 1) + week.weeks).month]
  end

  def serial_data
    @serial_data ||= @serial_number.match(serial_regex)&.named_captures || {}
  end

  def serial_regex
    raise NotImplementedError, "You must implement the serial_regex method for #{self.class}"
  end
end
```

```ruby
# frozen_string_literal: true

# General Electric decoder
class GeDecoder < ActiveDecoder
  def years = YEARS[serial_data["year"]]
  def month = MONTHS[serial_data["month"]]

  private

  def serial_regex
    @serial_regex ||= /\A(?<month>[ADFGHLMRSTVZ])(?<year>[ADFGHLMRSTVZ])\w{6,7}\z/
  end

  YEARS = {
    "A" => %w[1991 2003 2015],
    "D" => %w[1992 2004 2016],
    "F" => %w[1993 2005 2017],
    "G" => %w[1994 2006 2018],
    "H" => %w[1995 2007 2019],
    "L" => %w[1996 2008 2020],
    "M" => %w[1997 2009 2021],
    "R" => %w[1998 2010 2022],
    "S" => %w[1999 2011 2023],
    "T" => %w[2000 2012 2024],
    "V" => %w[2001 2013 2025],
    "Z" => %w[2002 2014 2026]
  }.freeze

  MONTHS = {
    "A" => "Jan",
    "D" => "Feb",
    "F" => "Mar",
    "G" => "Apr",
    "H" => "May",
    "L" => "Jun",
    "M" => "Jul",
    "R" => "Aug",
    "S" => "Sep",
    "T" => "Oct",
    "V" => "Nov",
    "Z" => "Dec"
  }.freeze
end
```

## Why it matters
- Template-method with `NotImplementedError` keeps vendor variants to one regex plus two maps — new vendor means one small subclass, no conditional sprawl.
- `match.named_captures` decouples parsing from interpretation; ambiguous year letters resolve to candidate lists filtered against today.
- `estimate_month_from_week` shows how week-based serials reuse the same seam without changing callers (`decode` / `decode_manufacture_date`).

> Source: inbox/code/internal-app/app/decoders/active_decoder.rb · processed 2026-11-23
