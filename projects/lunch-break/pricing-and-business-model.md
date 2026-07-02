# Side-Project SaaS Pricing and Business Model for Meal Tracking App

Business model decisions for a lifestyle side-hustle SaaS — a meal tracking PWA
(running Elixir/Phoenix with OpenRouter AI inference) designed to be self-sustaining,
not a venture-scale startup. All decisions prioritize simplicity, predictable costs, and
low support burden.

## Decision: Hybrid BYOK + Hosted Tier Model

**Two user types:**

1. **BYOK users** — bring their own OpenRouter API key; pay their own inference
   costs. Near-zero marginal cost for the business.
2. **Hosted users** — subscribe; the app provides AI usage.

**Rationale:** BYOK users provide validation, feedback, and word-of-mouth without
inference risk. Hosted users are the revenue engine.

## Decision: Pricing Tiers

| Tier     | Price        | What's included |
|----------|-------------|----------------|
| Free     | $0          | Manual tracking, limited AI trial (~20 parses/month) |
| BYOK     | Free (beta) / $10/year | Own API key, full AI logging, export, advanced stats |
| Hosted Pro | $2.99/month or $24/year | No API key needed, AI meal parsing included |

**Rationale for $2.99/month:** $1–2 feels too cheap (creates support expectations
without revenue); $2.99 feels affordable; $24/year reduces churn and payment
processing burden. Annual plan saves ~33%.

## Decision: Prefer Annual over Monthly

Annual plans are underrated for side businesses:
- Less payment processing overhead
- Lower churn
- Better cash flow
- Less admin

## Decision: Avoid "Unlimited AI" Claim

Even with cheap models, "unlimited" invites power users, abuse, and cost spikes.
Use soft caps like "~300 AI meal analyses/month for hosted users" and position it as
"designed for personal daily meal logging."

## Decision: Delay Infrastructure Scaling

**Phase 0 (now):** 1 server (app + DB), no load balancer, no permanent staging.
Target cost: $5–15/month.

**Phase 1 (5–20 paying users):** Maybe upgrade server ($8–12), add basic backups
and monitoring. Target: $10–20/month.

**Phase 2 (20–50 paying):** Separate DB (optional), maybe second server. Target:
$20–40/month.

**Rationale:** Upgrading prematurely (2 servers, LB, staging) jumps costs from
~$10/month to $50–80/month, requiring 30+ paying users just to break even.
Scale only when pain forces it (high CPU, memory issues, user complaints).

## Unit Economics

| Metric | Value |
|--------|-------|
| Fixed monthly cost (current) | ~$5–10 |
| Hosted AI cost per user | ~$0.30–1.00 (light), ~$1.00–3.00 (heavy) |
| Target hosted AI cost/user | $0.25–0.75 |
| Payment processing fee (monthly) | ~$0.39 ($2.99 × 2.9% + $0.30) |
| Net margin per hosted user | ~$1.59–2.39 |

### Break-even Analysis

| Fixed Cost | Margin/User | Users to Break Even |
|-----------|-------------|---------------------|
| $8        | $2.00       | 4                   |
| $30       | $2.30       | 13                  |
| $50       | $2.00       | 25                  |
| $80       | $1.85       | 44                  |

With the lean approach, only 4–6 paid users are needed to break even.

## App Store Consideration

No iOS/Android native apps planned — PWA only. This avoids app store commission
(Apple/Google take ~15–30% of subscriptions).

## Positioning

Not "AI meal tracking with many models" — pitch as:
- Frictionless meal logging
- Privacy-friendly
- Bring your own AI key if you want
- Cheap hosted option if you don't

> Source: inbox/chats/meal-app-pricing.md · processed 2026-07-02
