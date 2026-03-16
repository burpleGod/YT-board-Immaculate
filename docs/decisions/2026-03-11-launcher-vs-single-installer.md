# Decision: Launcher App vs Single Installer

**Date:** 2026-03-11
**Owner:** DevOps (Mylo)
**Phase:** 4B pre-work
**Status:** LOCKED

## Decision

Ship a **single installer**. Profile management lives inside the app as a profile selector modal on launch.

## Reasoning

1. The Phase 4B architecture (hg-profiles.json, profile selector on launch, isolated state.json per profile) is a complete internal profile system. No second executable is needed.
2. A launcher doubles the deployment surface: two installers, two auto-update pipelines, two code-signing certificates, two electron-builder configs. Team capacity does not justify this.
3. The target user is a solo creator. A lightweight in-app profile switcher is the right UX for this audience.
4. A launcher is a Phase 6+ conversation if multi-user demand warrants it. Building it now is overengineering.

## Implementation

| Item | Detail |
|------|--------|
| Architecture | Single installer |
| Profile management | Internal — profile selector modal on launch if multiple profiles exist |
| `hg-profiles.json` location | `%ProgramData%\HaroldGrayblood\hg-profiles.json` |
| Auto-update | Single pipeline — existing `electron-updater` config in `package.json` |
| Revisit | Flag for Phase 6 if multi-user demand warrants it |

## What this unblocks

Phase 4B (multi-creator architecture) — Karina and Backend can proceed immediately.
