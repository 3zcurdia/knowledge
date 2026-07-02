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

> Source: inbox/chats/intel-gens.md · processed 2026-07-02
