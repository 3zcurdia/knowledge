# Apple A-Series SoC Specifications

Detailed specifications for every generation of Apple's A-series system-on-chip family used in iPhone, iPad, Apple TV, and MacBook Neo.

## Comparison Table

| Chip | Process | Manufacturer | Transistors | Die Size | CPU ISA | CPU Cores | CPU Clock | GPU | First Release |
|------|---------|-------------|-------------|----------|---------|-----------|-----------|-----|---------------|
| A4 | 45 nm | Samsung | — | 53.3 mm² | ARMv7 | Cortex-A8 (1) | 800 MHz–1 GHz | PowerVR SGX 535 | March 2010 |
| A5 | 45 nm | Samsung | — | 122.2 mm² | ARMv7 | Cortex-A9 (2) | 800 MHz–1 GHz | PowerVR SGX543MP2 | March 2011 |
| A5 (32nm) | 32 nm HKMG | Samsung | — | 69.6 mm² | ARMv7 | Cortex-A9 (2) | — | PowerVR SGX543MP2 | March 2012 |
| A5X | 45 nm | Samsung | — | 165 mm² | ARMv7 | Cortex-A9 (2) | 1 GHz | PowerVR SGX543MP4 | March 2012 |
| A6 | 32 nm HKMG | Samsung | — | 96.71 mm² | ARMv7s | Swift (2) | 1.3 GHz | PowerVR SGX 543MP3 | September 2012 |
| A6X | 32 nm HKMG | Samsung | — | 123 mm² | ARMv7s | Swift (2) | 1.4 GHz | PowerVR SGX 554MP4 | October 2012 |
| A7 | 28 nm HKMG | Samsung | 1 billion | 102 mm² | ARMv8.0-A | Cyclone (2) | 1.3–1.4 GHz | PowerVR G6430 | September 2013 |
| A8 | 20 nm HKMG | TSMC | 2 billion | 89 mm² | ARMv8.0-A | Typhoon (2) | 1.4 GHz | PowerVR GX6450 | September 2014 |
| A8X | 20 nm HKMG | TSMC | 3 billion | 128 mm² | ARMv8.0-A | Typhoon (3) | 1.5 GHz | PowerVR GXA6850 (8-core) | October 2014 |
| A9 | 14/16 nm FinFET | Samsung/TSMC | ≥ 2 billion | 96/104.5 mm² | ARMv8.0-A | Twister (2) | 1.85 GHz | PowerVR GT7600 | September 2015 |
| A9X | 16 nm FinFET | TSMC | ≥ 3 billion | 143.9 mm² | ARMv8.0-A | Twister (2) | 2.16–2.26 GHz | PowerVR GT7850 | November 2015 |
| A10 Fusion | 16 nm FinFET | TSMC | 3.3 billion | 125 mm² | ARMv8.1-A | Hurricane (2) + Zephyr (2) | 2.34 GHz | PowerVR GT7600 Plus | September 2016 |
| A10X Fusion | 10 nm FinFET | TSMC | ≥ 4 billion | 96.4 mm² | ARMv8.1-A | Hurricane (3) + Zephyr (3) | 2.36 GHz | — | June 2017 |
| A11 Bionic | 10 nm FinFET | TSMC | 4.3 billion | 87.66 mm² | ARMv8.2-A | Monsoon (2) + Mistral (4) | — | Apple GPU (3-core) | September 2017 |
| A12 Bionic | 7 nm (N7) FinFET | TSMC | 6.9 billion | 83.27 mm² | ARMv8.3-A | Vortex (2) + Tempest (4) | — | Apple GPU (4-core) | September 2018 |
| A12X Bionic | 7 nm (N7) FinFET | TSMC | 10 billion | 135 mm² | ARMv8.3-A | Vortex (4) + Tempest (4) | — | Apple GPU (7-core) | October 2018 |
| A12Z Bionic | 7 nm (N7) FinFET | TSMC | 10 billion | 135 mm² | ARMv8.3-A | Vortex (4) + Tempest (4) | — | Apple GPU (8-core) | March 2020 |
| A13 Bionic | 7 nm (N7P) FinFET | TSMC | 8.5 billion | 98.48 mm² | ARMv8.4-A | Lightning (2) + Thunder (4) | — | Apple GPU (4-core) | September 2019 |
| A14 Bionic | 5 nm (N5) FinFET | TSMC | 11.8 billion | 88 mm² | ARMv8.5-A | Firestorm (2) + Icestorm (4) | — | Apple GPU (4-core) | September 2020 |
| A15 Bionic | 5 nm (N5P) FinFET | TSMC | 15 billion | 108.01 mm² | ARMv8.5-A | Avalanche (2) + Blizzard (4) | — | Apple GPU (4/5-core) | September 2021 |
| A16 Bionic | 4 nm (N4P) FinFET | TSMC | 16 billion | 112.75 mm² | ARMv8.6-A | Everest (2) + Sawtooth (4) | — | Apple GPU (5-core) | September 2022 |
| A17 Pro | 3 nm (N3B) FinFET | TSMC | 19 billion | 103.80 mm² | ARMv8.6-A | Everest (2) + Sawtooth (4) | — | Apple GPU (6-core) | September 2023 |
| A18 | 3 nm (N3E) FinFET | TSMC | — | 90 mm² | ARMv9.2A | — | — | Apple GPU (5-core) | September 2024 |
| A18 Pro | 3 nm (N3E) FinFET | TSMC | — | 105 mm² | ARMv9.2A | — | — | Apple GPU (6-core) | September 2024 |
| A19 | 3 nm (N3P) FinFET | TSMC | — | 84.56 mm² | — | — | — | Apple GPU (5-core) | September 2025 |
| A19 Pro | 3 nm (N3P) FinFET | TSMC | — | 98.69 mm² | — | — | — | Apple GPU (6-core) | September 2025 |

## Key Milestones

- **A4 (2010)**: First Apple-designed SoC, manufactured by Samsung
- **A7 (2013)**: First 64-bit chip in a smartphone, introduced Secure Enclave
- **A8 (2014)**: First A-series manufactured by TSMC (replacing Samsung)
- **A10 Fusion (2016)**: Introduced big.LITTLE heterogeneous CPU design
- **A11 Bionic (2017)**: First Apple-designed GPU and Neural Engine
- **A12 Bionic (2018)**: First 7nm smartphone chip
- **A14 Bionic (2020)**: First commercially available 5nm chipset
- **A16 Bionic (2022)**: First 4nm smartphone processor (N4P)
- **A17 Pro (2023)**: First 3nm SoC, hardware ray tracing

## Neural Engine Evolution

| Chip | Neural Engine Cores | Performance |
|------|-------------------|-------------|
| A11 Bionic | 2-core | 600 billion ops/sec |
| A12 Bionic | 8-core | 5 trillion ops/sec |
| A13 Bionic | 8-core | 1 trillion ops/sec |
| A14 Bionic | 16-core | 11 trillion ops/sec |
| A15 Bionic | 16-core | 15.8 trillion ops/sec |
| A16 Bionic | 16-core | 17 trillion ops/sec |
| A17 Pro | 16-core | 35 trillion ops/sec |

## See also

- [Apple Silicon Overview](../concepts/apple-silicon-overview.md)
- [Apple A-Series SoCs](../concepts/apple-a-series-socs.md)
- [Apple M-Series SoC Specifications](apple-m-series-specs.md)

> Source: inbox/articles/Apple_silicon.md · processed 2026-07-03
