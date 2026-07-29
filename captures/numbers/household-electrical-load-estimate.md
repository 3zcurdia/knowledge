# Household Electrical Load Estimate

Household power consumption estimates for a 2-bedroom house with 1 studio, kitchen, living room, 2 bathrooms, and various appliances including induction stove, dishwasher, garbage disposer, laundry center (gas dryer), French-door refrigerator, horizontal freezer, and homelab.

## Appliance Load Table

| Load | Typical Running Power | Possible Peak |
|------|----------------------|---------------|
| PC | 300 W | 300–500 W |
| Homelab | (add prior estimate) | (add prior estimate) |
| French-door refrigerator + freezer | 150–300 W | 800–1,200 W startup |
| Horizontal freezer | 80–180 W | 400–800 W startup |
| Dishwasher | 1,200–1,800 W | 1,800 W |
| Induction stove | 2,000–4,000 W typical cooking | 5,000–7,200 W maximum |
| Garbage disposer | 500–800 W | 800–1,200 W startup |
| Washer | 300–700 W | 700 W |
| Gas dryer electrical load | 300–600 W | 600–900 W |
| Lighting, Wi-Fi, TVs, chargers, kitchen appliances, etc. | 500–1,500 W | 1,500–2,500 W |
| Studio equipment / additional electronics | 300–1,000 W | 1,000–1,500 W |

## Resulting Demand

- Normal active usage: about 2.5–4.5 kW + homelab
- Busy evening — cooking, dishwasher, laundry, PCs/homelab, lights: about 5–8 kW + homelab
- Realistic worst-case simultaneous peak: about 9–13 kW + homelab
- For example, if the homelab estimate was 600 W, plan for: Practical peak ≈ 10–14 kW

## Recommended Capacity

For a house configured this way, particularly with an induction stove:

- Minimum sensible electrical capacity: 12 kW
- More comfortable / future-proof capacity: 15 kW

At 220 V, that corresponds roughly to:

- 12 kW → 55 A
- 15 kW → 68 A

A 220 V, 60–80 A service would generally be the appropriate planning range, subject to local code and an electrician's load calculation.

The induction stove is the major driver. If it can be used at full output while the dishwasher is heating and laundry is running, undersizing the service can cause nuisance breaker trips. Refrigerators/freezers also have brief compressor startup surges, but these are usually not the main sizing issue.

To finalize this precisely, add the homelab's measured or estimated maximum draw to the numbers above, and use the nameplate ratings for the induction cooktop and dishwasher.

> Source: inbox/chats/conversation.md · processed 2026-07-29
