# Desktop CPU Generation Comparison

Comprehensive reference of mainstream desktop CPU generations from Intel Core and AMD Ryzen, covering process nodes, core/thread counts, integrated GPU specs, and key architectural changes.

## Intel Core Desktop Processors

| Generation | Codename | Release Year | Process Node | Series | Cores (Threads) | iGPU Model | iGPU Max Freq (MHz) | Notes |
|---|---|---|---|---|---|---|---|---|
| 1st Gen | Clarkdale/Lynnfield | 2010 | 32 nm | i3/i5/i7 | 2-4 (4-8) | Intel HD Graphics | 733-900 | i7-9xx (Lynnfield) has no iGPU |
| 2nd Gen | Sandy Bridge | 2011 | 32 nm | i3/i5/i7 | 2-4 (4-8) | HD Graphics 2000/3000 | 850-1100 | i7-2xxx (Sandy Bridge-E) has no iGPU |
| 3rd Gen | Ivy Bridge | 2012 | 22 nm | i3/i5/i7 | 2-4 (4-8) | HD Graphics 2500/4000 | 1050-1150 | i7-3xxx (Ivy Bridge-E) has no iGPU |
| 4th Gen | Haswell | 2013-2014 | 22 nm | i3/i5/i7 | 2-4 (4-8) | HD Graphics 4400/4600 | 1150-1200 | i7-4xxx (Haswell-E) has no iGPU; limited desktop release (e.g., i7-5775C) |
| 5th Gen | Broadwell | 2015 | 14 nm | i5/i7 | 4 (8) | Iris Pro 6200 | — | — |
| 6th Gen | Skylake | 2015-2016 | 14 nm | i3/i5/i7 | 2-4 (4-8) | HD Graphics 530 | 1150 | i7-6xxx (Skylake-X) has no iGPU |
| 7th Gen | Kaby Lake | 2017 | 14 nm++ | i3/i5/i7 | 2-4 (4-8) | HD Graphics 630 | 1150 | i7-7xxx (Kaby Lake-X) has no iGPU |
| 8th Gen | Coffee Lake | 2017-2018 | 14 nm++ | i3/i5/i7 | 4-6 (4-12) | UHD Graphics 630 | 1100-1200 | Core count increased; i3 became quadcore |
| 9th Gen | Coffee Lake Refresh | 2018-2019 | 14 nm++ | i3/i5/i7 | 4-8 (4-16) | UHD Graphics 630 | 1100-1200 | i7 lost hyperthreading (8c/8t); i9 introduced |
| 10th Gen | Comet Lake | 2020 | 14 nm++ | i3/i5/i7 | 4-8 (8-16) | UHD Graphics 630 | 1100-1200 | i7 returned to hyperthreading (8c/16t) |
| 11th Gen | Rocket Lake | 2021 | 14 nm+++ | i3/i5/i7 | 4-8 (8-16) | UHD Graphics 750 | 1300-1350 | Last 14nm desktop Core |
| 12th Gen | Alder Lake | 2021-2022 | Intel 7 (10nm) | i3/i5/i7 | 6-12 (12-20) | UHD Graphics 770 | 1450-1500 | Hybrid architecture (P-cores + E-cores) |
| 13th Gen | Raptor Lake | 2022-2023 | Intel 7 (10nm) | i3/i5/i7 | 6-16 (12-24) | UHD Graphics 770 | 1650 | Increased E-cores |
| 14th Gen | Raptor Lake Refresh | 2023-2024 | Intel 7 (10nm) | i3/i5/i7 | 6-16 (12-24) | UHD Graphics 770 | 1650 | Minor refresh of 13th Gen |
| — | Arrow Lake (Core Ultra Series 2) | 2024-2025 | Intel 3 / TSMC N3 | Ultra 5/7 | 10-20 (10-20) | Intel Graphics (Xe-LPG) | ~2000 | New naming scheme; i3/i9 dropped in mainstream |

Note: Intel "F" series processors (e.g., i5-12400F) do not have integrated graphics.

## AMD Ryzen Desktop Processors

| Generation | Codename | Release Year | Process Node | Series | Cores (Threads) | iGPU Model | iGPU Max Freq (MHz) | Notes |
|---|---|---|---|---|---|---|---|---|
| 1000 Series | Summit Ridge | 2017 | 14 nm (GF) | Ryzen 5/7 | 4-8 (8-16) | None | N/A | First Gen Ryzen; no iGPU on standard desktop CPUs |
| 2000 Series | Pinnacle Ridge | 2018 | 12 nm (GF) | Ryzen 5/7 | 4-8 (8-16) | None | N/A | Zen+ architecture |
| 2000 Series (APU) | Raven Ridge | 2018 | 14 nm (GF) | Ryzen 3/5 | 4 (4-8) | Radeon Vega 8/11 | 1250 | First Ryzen APUs |
| 3000 Series | Matisse | 2019 | 7 nm (TSMC) | Ryzen 5/7/9 | 6-16 (12-32) | None | N/A | Zen 2 architecture; Ryzen 9 introduced |
| 3000 Series (APU) | Picasso | 2019 | 14/12 nm (GF) | Ryzen 3/5 | 4 (4-8) | Radeon Vega 8/11 | 1250 | Refresh of 2000G series |
| 4000 Series (APU) | Renoir | 2020 | 7 nm (TSMC) | Ryzen 3/5/7 | 4-8 (8-16) | Radeon Vega 6/7/8 | 1750-1900 | Zen 2 APUs |
| 5000 Series | Vermeer | 2020-2021 | 7 nm (TSMC) | Ryzen 5/7/9 | 6-16 (12-32) | None | N/A | Zen 3 architecture |
| 5000 Series (APU) | Cezanne | 2021-2022 | 7 nm (TSMC) | Ryzen 5/7 | 6-8 (12-16) | Radeon Vega 7/8 | 1900-2100 | Zen 3 APUs |
| 7000 Series | Raphael | 2022 | 5 nm (TSMC) | Ryzen 5/7/9 | 6-16 (12-32) | Radeon Graphics (RDNA 2) | 2200 | First desktop Ryzen with basic iGPU (2 CUs) |
| 8000 Series (APU) | Phoenix | 2024 | 4 nm (TSMC) | Ryzen 5/7 | 6-8 (12-16) | Radeon 760M/780M | 2600-2900 | Zen 4 APUs with powerful RDNA 3 iGPU |
| 9000 Series | Granite Ridge | 2024 | 4 nm (TSMC) | Ryzen 5/7/9 | 6-16 (12-32) | Radeon Graphics (RDNA 2) | 2200 | Zen 5 architecture; iGPU same as 7000 series |

Note: AMD "F" series processors (e.g., Ryzen 5 7500F) do not have integrated graphics. AMD "G" series processors are APUs with powerful integrated graphics.

## Key Observations

- **Transistor Size**: Intel moved from 32nm to 14nm (and refined it for many generations) before moving to Intel 7 (10nm). AMD moved from 14nm (GlobalFoundries) to 7nm, 5nm, and 4nm (TSMC).
- **Integrated Graphics**: Intel has included iGPUs in most mainstream CPUs (except "F" models and some HEDT). AMD only recently included basic iGPUs in their standard desktop CPUs (7000/9000 series), while their "G" series APUs feature much more powerful Radeon graphics.
- **Core Counts**: Both manufacturers have significantly increased core counts over the years. Intel introduced hybrid architecture (P-cores and E-cores) in the 12th Gen, while AMD has maintained homogeneous core complexes until recent mobile/hybrid announcements.
- **Naming**: Intel has recently shifted from "Core i3/i5/i7/i9" to "Core 3/5/7" and "Core Ultra 5/7/9". AMD continues with Ryzen 3/5/7/9.

## See also

- [Intel Processor Naming Conventions](../../notes/intel-processor-naming-conventions.md)
- [MOSFET scaling — process node timeline](mosfet-scaling-process-nodes.md)
- [Moore's law](moores-law.md)

> Source: inbox/chats/cpu-gens.md · processed 2026-07-09
