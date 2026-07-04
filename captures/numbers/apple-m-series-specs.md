# Apple M-Series SoC Specifications

Detailed specifications for every generation of Apple's M-series system-on-chip family used in Mac, iPad Pro, iPad Air, and Apple Vision Pro.

## Comparison Table

| Chip | Process | Transistors | Die Size | CPU ISA | Perf Cores | Eff Cores | Super Cores | GPU Cores | Neural Engine | Max RAM | Mem BW | Clock | First Release |
|------|---------|-------------|----------|---------|------------|-----------|-------------|-----------|---------------|---------|--------|-------|---------------|
| M1 | TSMC N5 | 16B | 118.91 mm² | ARMv8.5A | 4 | 4 | — | 8 | 16-core | 16 GB | 68.25 GB/s | 3.20 GHz | November 2020 |
| M1 Pro | TSMC N5 | 33.7B | ≈245 mm² | ARMv8.5A | 6–8 | 2 | — | 14–16 | 16-core | 32 GB | 200 GB/s | 3.23 GHz | October 2021 |
| M1 Max | TSMC N5 | 57B | ≈432 mm² | ARMv8.5A | 8 | 2 | — | 24–32 | 16-core | 64 GB | 400 GB/s | 3.23 GHz | October 2021 |
| M1 Ultra | TSMC N5 | 114B | ≈864 mm² | ARMv8.5A | 16 | 4 | — | 48–64 | 32-core | 128 GB | 800 GB/s | 3.23 GHz | March 2022 |
| M2 | TSMC N5P | 20B | 155.25 mm² | ARMv8.6A | 4 | 4 | — | 8–10 | 16-core | 24 GB | 100 GB/s | 3.49 GHz | June 2022 |
| M2 Pro | TSMC N5P | 40B | ≈289 mm² | ARMv8.6A | 6–8 | 4 | — | 16–19 | 16-core | 32 GB | 200 GB/s | 3.49 GHz | January 2023 |
| M2 Max | TSMC N5P | 67B | — | ARMv8.6A | 8 | 4 | — | 30–38 | 16-core | 96 GB | 400 GB/s | 3.60 GHz | January 2023 |
| M2 Ultra | TSMC N5P | 134B | — | ARMv8.6A | 16 | 8 | — | 60–76 | 32-core | 192 GB | 800 GB/s | 3.60 GHz | June 2023 |
| M3 | TSMC N3B | 25B | 152.53 mm² | ARMv8.6A | 4 | 4 | — | 8–10 | 16-core | 24 GB | 100 GB/s | 4.05 GHz | October 2023 |
| M3 Pro | TSMC N3B | 37B | 219.22 mm² | ARMv8.6A | 5–6 | 6 | — | 14–18 | 16-core | 36 GB | 150 GB/s | 4.05 GHz | October 2023 |
| M3 Max | TSMC N3B | 92B | — | ARMv8.6A | 10–12 | 4 | — | 30–40 | 16-core | 128 GB | 400 GB/s | 4.05 GHz | October 2023 |
| M3 Ultra | TSMC N3B | 184B | — | ARMv8.6A | 20–24 | 8 | — | 60–80 | 32-core | 512 GB | 800 GB/s | 4.05 GHz | March 2025 |
| M4 | TSMC N3E | 28B | 169.35 mm² | ARMv9.2A | 3–4 | 4–6 | — | 9–10 | 16-core | 32 GB | 120 GB/s | 4.40 GHz | May 2024 |
| M4 Pro | TSMC N3E | — | — | ARMv9.2A | 8–10 | 4 | — | 16–20 | 16-core | 64 GB | 273 GB/s | 4.50 GHz | October 2024 |
| M4 Max | TSMC N3E | — | — | ARMv9.2A | 10–12 | 4 | — | 32–40 | 16-core | 128 GB | 546 GB/s | 4.50 GHz | October 2024 |
| M5 | TSMC N3P | — | 157.48 mm² | — | 4–6 | — | 4 | 10 | 16-core | — | — | 4.40–4.61 GHz | October 2025 |
| M5 Pro | TSMC N3P | — | — | — | 12 | — | 6 | 20 | 16-core | 64 GB | 307 GB/s | 4.61 GHz | March 2026 |
| M5 Max | TSMC N3P | — | — | — | 12 | — | 6 | 40 | 16-core | 128 GB | 614 GB/s | 4.61 GHz | March 2026 |

## Key Milestones

- **M1 (November 2020)**: First Apple silicon for Mac, TSMC 5nm, 16B transistors
- **M1 Pro/Max (October 2021)**: Introduced tiered Pro/Max scaling
- **M1 Ultra (March 2022)**: First UltraFusion interconnect, 114B transistors
- **M2 (June 2022)**: N5P process, 20B transistors, 100 GB/s memory bandwidth
- **M3 (October 2023)**: First 3nm Mac chip (N3B), hardware ray tracing and mesh shading
- **M4 (May 2024)**: First ARMv9.2-A instruction set, N3E process
- **M5 (October 2025)**: Introduced "super" cores alongside performance cores, N3P process

## UltraFusion Interconnect

UltraFusion is Apple's silicon interconnect technology that connects two Max dies into a single Ultra package:

| Ultra Chip | Base Dies | Transistors | Memory BW | Max RAM |
|------------|-----------|-------------|-----------|---------|
| M1 Ultra | 2× M1 Max | 114B | 800 GB/s | 128 GB |
| M2 Ultra | 2× M2 Max | 134B | 800 GB/s | 192 GB |
| M3 Ultra | 2× M3 Max | 184B | 800 GB/s | 512 GB |

## Memory Bandwidth Progression

| Generation | Base | Pro | Max | Ultra |
|------------|------|-----|-----|-------|
| M1 | 68.25 GB/s | 200 GB/s | 400 GB/s | 800 GB/s |
| M2 | 100 GB/s | 200 GB/s | 400 GB/s | 800 GB/s |
| M3 | 100 GB/s | 150 GB/s | 400 GB/s | 800 GB/s |
| M4 | 120 GB/s | 273 GB/s | 546 GB/s | — |
| M5 | — | 307 GB/s | 614 GB/s | — |

## See also

- [Apple Silicon Overview](../concepts/apple-silicon-overview.md)
- [Apple M-Series SoCs](../concepts/apple-m-series-socs.md)
- [Apple A-Series SoC Specifications](apple-a-series-specs.md)

> Source: inbox/articles/Apple_silicon.md · processed 2026-07-03
