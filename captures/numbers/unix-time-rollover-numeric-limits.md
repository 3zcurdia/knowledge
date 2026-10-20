# Key Numeric Limits and Dates for Unix Time Rollover

## Signed 32-bit Limits

- Range of a signed 32-bit integer: −(2^31) to 2^31 − 1.
- Maximum value: 2,147,483,647 seconds after the epoch, which is 03:14:07 UTC on 19 January 2038.
- Overflow value −(2^31) wraps to 20:45:52 UTC on 13 December 1901.
- The tm_year field caps the year at 2,147,485,547 (2,147,483,647 + 1900).

## Extended Ranges

- Unsigned 32-bit time_t: up to 06:28:15 UTC on Sunday, 7 February 2106.
- Signed 64-bit time_t: wraparound about 292 billion years from now, roughly 21 times the estimated age of the universe (13.79 billion years). The source calculation is 2^63 seconds ÷ 60 ÷ 60 ÷ 24 ÷ 365.2425 days per Gregorian year ≈ 292.277 billion years.
- Signed 64-bit milliseconds since 1 January 1970: about 292 million years.
- Signed 64-bit microseconds: minimum range of 292,000 years.
- ext4 extended timestamps: year 2446. XFS big timestamps: year 2486.
- OpenVMS native APIs: up to 31 July 31086.
- Windows FILETIME (100-nanosecond intervals since 1 January 1601, 64-bit signed): overflow in year 30,828.

## Other Dated Values

- AOLserver incident: one billion seconds before the 2038 cutoff is 01:27:28 UTC on 13 May 2006.
- Oracle cookie expiry of 500,000,000 seconds (about 15 years and 312 days) crossed 19 January 2038 from 02:20:48 UTC on 17 March 2022.
- Windows 10 x86 clock skip target: 12 April 2160.
- Visual Studio _gmtime32 rollover: 19 January 2038 00:00:00.

## See also

- [Year 2038 Problem Root Cause: 32-bit Unix Time Overflow](../concepts/year-2038-problem-32-bit-overflow.md)
- [Early Real-World Year 2038 Incidents (2006–2022)](../observations/year-2038-early-incidents.md)

> Source: inbox/articles/Year_2038_problem.md · processed 2026-10-20
