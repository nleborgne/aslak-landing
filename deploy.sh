#!/usr/bin/env bash
set -euo pipefail
cd ~/aslak-landing
git pull
~/.bun/bin/bun install --frozen-lockfile
~/.bun/bin/bun run build
sudo systemctl restart aslak