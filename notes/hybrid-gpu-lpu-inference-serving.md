# Splitting Inference — Pre-fill on GPUs, Decode on LPUs

## Two stages, two architectures

LLM inference consists of two stages. First, pre-fill: the prompt tokens are processed in parallel, like a batch of tokens — a natural fit for the GPU. Second, decode: the response is generated one token at a time, and as seen elsewhere, that work is easily bottlenecked by memory — generally a great match for the LPU. There is one wrinkle: when generating a new token, an LLM attends to every previous token. To avoid recomputing them, it stores two activations per past token — a key and a value — in what is called the KV cache. That cache grows with every token and every user into gigabytes, far more than the LPU's SRAM can hold. So attention stays on the GPU. What is left for Groq are the feed-forward layers, which is where most of the model weights live anyway.

## Why not run everything on one chip

It comes down to how each architecture pays for memory. A GPU amortizes the time spent copying from HBM with a large batch, which makes the cost per token very low. Groq skips the copying all together and immediately responds to a query — but now you need hundreds of chips with SRAM, which gets pricey, somewhere between $15,000 and $20,000 per chip. Splitting the model is not quite as efficient on either side, but for the last mile it is more efficient than having one kind of chip do everything: putting the two together is like putting 18-wheelers and delivery vans together — projections on the LPUs, attention on the GPUs, and then you get the best of both worlds.

## See also

- [Groq's LPU — determinism through static scheduling](groq-lpu-static-scheduling-determinism.md)

> Source: inbox/video/It’s von Neumann’s fault ｜ GPU · TPU · LPU [yTXHZxXXjPI].md · processed 2026-11-04
