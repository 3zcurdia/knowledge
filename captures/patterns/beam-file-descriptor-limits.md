# BEAM File Descriptor Limits: ulimit, +Q, and Containers

New connections stop arriving when the file descriptor budget runs out. Everything else looks normal — existing users, CPU, memory, `:observer`. The default budget on most Linux systems is 1,024 (`ulimit -n`). When it runs out, Ranch logs `{:error, :emfile}` and new connections are silently turned away.

Three limits form the effective ceiling, and all three must move together:

1. **Host OS ulimit** — set in `/etc/security/limits.conf` or systemd `LimitNOFILE`
2. **Container ulimit** — set in `docker-compose.yml` or ECS task definition
3. **BEAM `+Q`** — set in `vm.args`

The effective limit is always `min(ulimit -n, +Q)`. Raising only one leaves the others as the ceiling.

## Production Configuration

65,536 is the standard production value. Both the OS and the BEAM handle it comfortably on any modern server.

```
# /etc/security/limits.conf (or systemd: LimitNOFILE=65536)
* soft nofile 65536
* hard nofile 65536
```
```
# vm.args
+Q 65536
```

### Docker

```yaml
# docker-compose.yml
services:
  app:
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
```

### ECS

```json
"ulimits": [
  {
    "name": "nofile",
    "softLimit": 65536,
    "hardLimit": 65536
  }
]
```

## Verification

```bash
# Check the OS limit
ulimit -n

# Check the system-wide ceiling on Linux
cat /proc/sys/fs/file-max

# Find the BEAM process ID
pgrep beam.smp

# Check its limits
cat /proc/<pid>/limits | grep "open files"

# From inside a running BEAM node
:erlang.system_info(:port_limit)   # the +Q ceiling
:erlang.system_info(:port_count)   # current usage
```

If `port_limit` is lower than `ulimit`, `+Q` was not set. If `port_limit` is correct but connections are still refused, the container's `ulimit` was not set.

## Key Point

When connections are refused and everything else looks normal, check all three layers. Containers do not inherit the host's `ulimit` — each container gets its own resource limits, and the default is usually whatever the base image ships with.

## See also

- [Avoiding Double Mount in Phoenix LiveView](avoiding-double-mount-phoenix-liveview.md)
- [Distributed ML Inference on BEAM with Nx.Serving](distributed-ml-inference-beam-nx-serving.md)

> Source: inbox/articles/Beam in the Wild 3 Three Limits, One Fix. Why Raising ulimit Is Not Enough.md · processed 2026-07-02
