# AI Accelerator Performance and Scaling Figures

Key quantitative facts comparing AI accelerators — Google's TPU, Nvidia's GPU, and Groq's LPU — from the source video.

| Metric | Value | Context |
|--------|-------|---------|
| Nvidia's take | 80 cents per dollar | Share of every dollar spent on AI chips that Nvidia makes |
| 2013 Google speech system | 20% error-rate cut | Biggest jump in 20 years; about 40M parameters vs AlexNet's 60M |
| TPU v1 peak throughput | 92 trillion ops/sec | 8-bit integer MACs, about 35x the Google server CPU of the time |
| TPU v1 vs Nvidia K80 | 15x faster at less than half the power | First-generation ASIC result |
| TPU v1 control logic | 2% of die | A quarter goes to the matrix multiply unit, another third to the activation buffer |
| TPU v1 instruction set | ~1,000 x86 instructions vs a handful | TPU fetches its instructions from an external host CPU over PCIe |
| TPU v1 DRAM channel | 34 billion bytes/sec | vs 46 trillion bytes/sec naive demand at 700 MHz — processor idle 99.9% |
| TPU v1 on-chip memory | 28 MB SRAM + 8 GB DDR3 | SRAM is 10-20x less dense per bit than DRAM |
| TPU v1 peak batch | 250 | Batch needed for peak utilization; first-query latency suffers |
| TPU bandwidth V1 → V8 | 200x | Biggest single jump in V2, when HBM arrived |
| TPU compute V2 → V7 | 50x | At 16-bit precision |
| Largest TPU pod (V7) | more than 9,000 TPUs | Google connects thousands of boards into a pod |
| NVLink rack | 72 GPUs | Nvidia's equivalent scale-out, wired into a single rack |
| DeepMind 2023 serving | batch size 120 | Quantized Llama 3.1 70B on a TPU v5e to keep the chip busy |
| Groq LPU early 2024 | 240 tokens/sec | Llama 2 70B, twice as fast as the runner-up |
| Groq LPU SRAM | 230 MB | Forces a 70B model to be split across 576 chips |
| Groq LPU chip cost | $15,000 - $20,000 per chip | Price of the SRAM-only approach at scale |
| Groq latency prediction (2022) | off by only 1% | Model latency predicted before running it |

## See also

- [TPU vs GPU microarchitecture trade-offs](../observations/tpu-vs-gpu-microarchitecture-tradeoffs.md)
- [Moore's law](moores-law.md)

> Source: inbox/video/It’s von Neumann’s fault ｜ GPU · TPU · LPU [yTXHZxXXjPI].md · processed 2026-11-04
