# Intel Processor Naming Conventions

## Brand Tiers (Core Series)

| Brand   | Positioning                                             |
|---------|---------------------------------------------------------|
| Core i3 | Entry-level: web browsing, office, light streaming      |
| Core i5 | Sweet spot: multitasking, gaming, productivity          |
| Core i7 | High-end: enthusiasts, video editing, heavy multitasking |
| Core i9 | Top tier: 3D rendering, workstation tasks               |

Intel introduced **Core Ultra** branding for newer chips (Series 1: Meteor Lake, Series
2: Lunar Lake / Arrow Lake), moving away from the "i" prefix.

## Identifying Generations

The first one or two digits after the hyphen indicate the generation:

- `i7-9700` → 9th Gen
- `i5-12400` → 12th Gen
- `i9-14900K` → 14th Gen

Newer generations generally mean better power efficiency, higher speeds, and newer
features (faster RAM support, better integrated graphics).

## Suffix Decoding

| Suffix | Meaning |
|--------|---------|
| K      | Unlocked for overclocking |
| F      | No integrated graphics (requires dedicated GPU) |
| KF     | Unlocked + no integrated graphics |
| T      | Power-optimized for small desktop PCs |
| H/HK/HX | High-performance laptop chips (gaming/workstation) |
| U      | Ultra-low power (thin-and-light laptops) |

## Hybrid Architecture (12th Gen+)

Starting with 12th Gen Alder Lake, cores split into two types:

- **P-cores** (Performance): Handle heavy lifting and complex tasks
- **E-cores** (Efficient): Handle background tasks, save battery, reduce heat

A chip with 16 cores might have 8 P-cores and 8 E-cores.

## AMD Position Equivalents

| Intel        | AMD                  |
|-------------|----------------------|
| Core i3     | Ryzen 3              |
| Core i5     | Ryzen 5              |
| Core i7     | Ryzen 7              |
| Core i9     | Ryzen 9              |
| Core Ultra 5 | Ryzen AI 5 / Ryzen 5 |
| Core Ultra 7 | Ryzen AI 7 / Ryzen 7 |
| Core Ultra 9 | Ryzen AI 9 / Ryzen 9 |

These are market-position equivalents, not exact performance matches.

## Generation Timeline (Intel vs AMD)

| Intel Gen      | Release    | Codename            | Closest AMD Gen   | AMD Release | AMD Codename |
|---------------|-----------|---------------------|-------------------|-------------|-------------|
| 8th Gen       | 2017      | Coffee Lake          | Ryzen 1000        | 2017        | Zen         |
| 9th Gen       | 2018      | Coffee Lake Refresh  | Ryzen 2000        | 2018        | Zen+        |
| 10th Gen      | 2019–2020 | Comet Lake / Ice Lake| Ryzen 3000        | 2019        | Zen 2       |
| 11th Gen      | 2021      | Rocket Lake          | Ryzen 5000        | 2020        | Zen 3       |
| 12th Gen      | Late 2021 | Alder Lake           | Ryzen 5000/7000   | 2020–2022   | Zen 3 / 4   |
| 13th Gen      | Late 2022 | Raptor Lake          | Ryzen 7000        | 2022        | Zen 4       |
| 14th Gen      | Late 2023 | Raptor Lake Refresh  | Ryzen 7000/8000G  | 2022–2024   | Zen 4       |
| Core Ultra S1 | Late 2023 | Meteor Lake (mobile) | Ryzen 8040        | 2023        | Hawk Point  |
| Core Ultra S2 | 2024      | Lunar Lk / Arrow Lk  | Ryzen AI 300/9000 | 2024        | Zen 5       |

## Performance Summary by Era

| Period       | Intel                                     | AMD                                        |
|-------------|-------------------------------------------|--------------------------------------------|
| 2017–2018   | Better gaming                             | Better value and multicore                 |
| 2019–2020   | Competitive                               | Strong lead in efficiency and productivity |
| 2021        | 12th Gen regains leadership               | Ryzen 5000 still excellent                 |
| 2022–2023   | 13th Gen very competitive                 | Ryzen 7000 X3D dominates gaming            |
| 2024+       | Core Ultra focuses on AI and efficiency   | Ryzen 9000 strong; X3D top gaming choice   |

## Key Milestones

- **Intel 12th Gen (Alder Lake)**: Major redesign with hybrid P-cores and E-cores
- **Intel 14th Gen desktop**: Largely a refresh of 13th Gen
- **AMD AM5 socket**: Maintained since Ryzen 7000, enabling CPU upgrades without
  motherboard changes
- **AMD X3D processors** (7800X3D, 9800X3D): Widely regarded as best gaming
  CPUs due to large 3D V-Cache

## See also

- [NAS CPU Comparison for Home Media Servers](nas-cpu-comparison-home-media-server.md)
- [Refurbished ThinkCentre and ThinkPad Buying Guide](refurbished-thinkcentre-thinkpad-buying-guide.md)

> Source: inbox/chats/intel-gens.md · processed 2026-07-02
> Merged: notes/intel-vs-amd-cpu-generation-timeline.md · 2026-07-02
