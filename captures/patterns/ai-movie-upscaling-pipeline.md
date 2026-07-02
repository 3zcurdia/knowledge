# AI Movie Upscaling Pipeline for Local Hardware

A systematic approach for upscaling and restoring movies (e.g., DVD to 1080p) using
AI on local hardware. The key insight: **upscaling ≠ restoration** — you must denoise
before upscaling, then optionally reintroduce grain to avoid the "plastic AI look."

## Hardware Requirements

- **GPU**: RTX 5060 Ti 16GB VRAM (VRAM is the bottleneck, not CPU)
- **RAM**: 32GB sufficient
- **Storage**: 2TB SSD — intermediate frames can consume 300–800GB for a 2-hour movie

## Pipeline Stages

### Stage 1 — Decode & Prepare

Extract frames losslessly with ffmpeg:

```
ffmpeg -i input.mkv -qscale:v 1 frames/frame_%06d.png
```

Avoid compression artifacts stacking by using lossless extraction.

### Stage 2 — Pre-processing

DVD sources have noise, compression artifacts, and edge ringing. Denoising is
critical before upscaling — otherwise AI amplifies the garbage.

Options:
- ffmpeg denoise (`hqdn3d`)
- AI denoise: SCUNet / Neat Video

### Stage 3 — Upscaling

Best local options:

| Tool | Speed | Quality |
|------|-------|---------|
| Real-ESRGAN (ncnn Vulkan) | Fast | Good |
| ESRGAN variants (custom models) | Medium | Better |
| Video diffusion / temporal models (RIFE + ESRGAN combo) | Slow | Best |

Example Real-ESRGAN:

```
realesrgan-ncnn-vulkan -i frames -o upscaled -n realesrgan-x4plus
```

### Stage 4 — Face / Detail Restoration (Optional)

- **GFPGAN**: Face restoration
- **CodeFormer**: Better control

### Stage 5 — Reassemble Video

```
ffmpeg -framerate 24 -i upscaled/frame_%06d.png -c:v libx264 -crf 18 output.mp4
```

Add original audio:

```
ffmpeg -i output.mp4 -i input.mkv -c copy -map 0:v -map 1:a final.mkv
```

## Processing Time Estimates (2-hour movie, 24 fps, ~172,800 frames)

| Pipeline | Estimated FPS | Total Time |
|----------|---------------|------------|
| Real-ESRGAN (fast) | 10–25 fps | 2–5 hours |
| High-quality (diffusion / multi-pass) | 1–5 fps | 10–48 hours |
| Heavy temporal models | 0.5–2 fps | 1–4 days |

## Recommended Tool Stack

- FFmpeg
- Real-ESRGAN (ncnn Vulkan version)
- GFPGAN
- VapourSynth (for advanced pipelines)
- Video2X (open-source wrapper)
- Hybrid (GUI + VapourSynth)

## Storage Management

1 movie → ~200k PNGs → 300–800 GB temporary. Use JPG at high quality instead of
PNG or process in chunks to reduce space usage.

## Key Workflow for DVD Sources

1. Denoise first
2. Upscale
3. Optionally reintroduce grain
4. Avoid amplifying DVD artifacts into the final output

> Source: inbox/chats/ai-upscale-movie.md · processed 2026-07-02
