# Connecting Open-WebUI to LM Studio via Docker

Open-WebUI can connect to LM Studio as an OpenAI-compatible backend, not via the Ollama native API. The setup involves Docker networking, socat port forwarding, and correct environment variables.

## Problem Setup

The user runs Open-WebUI in Docker on a CMK3888 (ARM, Debian/OMV7) and wants to reach LM Studio on a remote Orchemy 3.8 machine at `http://omarchy.local:1234/v1/models`.

## Issues Identified

1. **Port Mismatch**: socat was listening on port 1234 but Open-WebUI was configured to use port 1235. The URL inside Open-WebUI must be `http://omarchy:1234/v1`.
2. **host-gateway mapping**: `extra_hosts: omarchy:host-gateway` maps `omarchy` to the Docker host's IP (the CMK3888), not the remote machine. This is architecturally correct — the path is container → CMK3888 host → socat → omarchy.local.
3. **LM Studio is NOT Ollama**: Open-WebUI has two separate connection types — Ollama uses the Ollama native API at `http://host:11434`, while LM Studio uses the OpenAI-compatible API at `http://host:1234/v1`. Must configure as OpenAI API connection.

## Correct docker-compose.yml

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    volumes:
      - /srv/dev-disk-by-uuid-a3f7b2c1-8d4e-4a9f-b6e2-1c5d8f3a7b9e/containers/config/openwebui:/app/backend/data
      - /var/run/dbus:/var/run/dbus
      - /var/run/avahi-daemon/socket:/var/run/avahi-daemon/socket
    extra_hosts:
      - "omarchy:host-gateway"
    environment:
      WEBUI_SECRET_KEY: ${WEBUI_SECRET_KEY}
      # LM Studio — OpenAI-compatible, NOT Ollama
      OPENAI_API_BASE_URL: "http://omarchy:1234/v1"
      OPENAI_API_KEY: "lm-studio"
      # LM Studio ignores this, but it's required
      # Disable Ollama since you're not using it
      ENABLE_OLLAMA_API: "false"
    restart: unless-stopped
    ports:
      - "3000:8080"
```

## Persistent socat

Running `socat ... &` will die on reboot. Use a systemd unit on the CMK3888:

```ini
# /etc/systemd/system/socat-lmstudio.service
[Unit]
Description=Socat proxy to omarchy LM Studio
After=network.target

[Service]
ExecStart=/usr/bin/socat TCP-LISTEN:1234,fork,reuseaddr TCP:omarchy.local:1234
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now socat-lmstudio
```

## Verification

From the CMK3888 host (outside Docker):

```bash
curl http://localhost:1234/v1/models
```

From inside the running container:

```bash
docker exec -it open-webui curl http://omarchy:1234/v1/models
```

Both should return the model list JSON. If the second fails, the host-gateway resolution isn't working — replace `host-gateway` with the CMK3888's actual LAN IP:

```yaml
extra_hosts:
  - "omarchy:192.168.x.x"  # your CMK3888's actual IP
```

## Summary of Changes

| Problem | Fix |
|---|---|
| Port typo 1235 → 1234 | Fixed in env var |
| Wrong API type (Ollama vs OpenAI) | Use `OPENAI_API_BASE_URL` instead |
| socat dies on reboot | systemd service |
| Ollama errors in UI | Set `ENABLE_OLLAMA_API=false` |

> Source: inbox/chats/docker-open-webui-setup.md · processed 2026-07-09
