# BEAM Ecosystem Supply Chain Security Risks

The BEAM ecosystem (Erlang, Elixir, Gleam) faces supply-chain security risks similar to npm's `ctrl+tinycolor` incident, where a stolen publish token spread malware across hundreds of packages. While the smaller BEAM dependency tree reduces blast radius, a single compromised widely-used package could still ripple through hundreds of projects.

## Current Gaps

- **Account security:** 2FA is optional, not enforced. No WebAuthn support.
- **Publishing:** Long-lived API keys in CI with no trusted publishing (short-lived OIDC tokens).
- **Scanning:** No automated malware detection at publish time.
- **Provenance:** No package signatures or build attestations.
- **Warnings:** No registry-fed alerts surfaced in `mix` or `rebar3`.

## The Ægis Initiative

The Erlang Ecosystem Foundation's Ægis Initiative aims to address these gaps: WebAuthn-backed 2FA for publishers, trusted publishing via CI, Sigstore/SLSA provenance, registry scanning with advisories in tooling, and transparency logs with SBOMs.

> Source: inbox/articles/Erlang Ecosystem Foundation - Supporting the BEAM community.md · processed 2026-07-02
