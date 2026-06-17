# Deploy — CrossFit Aslak landing → OVH VPS

Production deploy runbook for `crossfitaslak.com` on a fresh OVH VPS (Debian 13 / trixie).

- **VPS**: fresh Debian 13, 1 vCPU, 3.8 GB RAM, 0 swap (clean slate, no old site).
- **App**: Next.js 16 landing, 2 routes (`/`, `/cf-form`), no backend.
- **Login user**: `debian` (has sudo).

---

## Decisions

| Topic | Choice | Why |
|---|---|---|
| Runtime | **Node server** (`next start` on `127.0.0.1:3000`), not static export | "Dynamic tomorrow"; avoids future migration; `cacheComponents` stays |
| Build | **On VPS** + 2 GB swap | Solo, low traffic; swap = OOM insurance on 1 vCPU |
| Tooling | **bun-only** (install / build / start) | Matches `bun.lock` + CLAUDE.md; one binary |
| Proxy + TLS | **Caddy** (auto-HTTPS) | Zero cert cron; ~4-line config |
| Domain | `crossfitaslak.com` @ OVH; A `@` + `www` → VPS IP | Caddy 301s www → apex |
| Deploy | **Manual git-pull** + `deploy.sh` + read-only deploy key | Simplest; same script becomes the GH Actions payload later |
| Supervisor | **systemd**, runs as `debian` (non-root) | Built-in, no extra dep |
| Hardening | ufw (22/80/443) + SSH key-only + app bound to localhost | Defense in depth |
| Form | **Ship dead** (known debt) | Deferred — see Known debt |

---

## Runbook

### 0. DNS (do first — propagates while you work)

In the OVH DNS zone for `crossfitaslak.com`:

- `A   @     → <VPS_IP>`
- `A   www   → <VPS_IP>`

- [x] DNS records set
- [x] `dig +short crossfitaslak.com` returns the VPS IP

### 1. Base setup (on VPS)

```bash
# --- swap (OOM insurance for builds) ---
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# --- packages: git, bun, caddy ---
sudo apt update && sudo apt install -y git curl debian-keyring debian-archive-keyring apt-transport-https unzip
curl -fsSL https://bun.sh/install | bash        # bun → ~/.bun/bin/bun
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy

# --- firewall ---
sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443
sudo ufw enable
```

- [x] swap active (`free -m` shows Swap > 0)
- [x] `bun --version` works
- [x] `caddy version` works
- [x] `sudo ufw status` shows 22/80/443 allowed

### 2. Repo access — read-only deploy key

```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""
cat ~/.ssh/deploy_key.pub      # → GitHub repo → Settings → Deploy keys → Add (read-only)
echo -e "Host github.com\n  IdentityFile ~/.ssh/deploy_key" >> ~/.ssh/config
git clone git@github.com:nleborgne/aslak-landing.git ~/aslak-landing
```

- [x] deploy key added to GitHub (read-only)
- [x] repo cloned to `~/aslak-landing`

### 3. App env + first build

```bash
cd ~/aslak-landing
echo "BASE_URL=https://crossfitaslak.com" > .env
~/.bun/bin/bun install --frozen-lockfile
~/.bun/bin/bun run build
```

> `.env` is gitignored — recreate it on the server (only `BASE_URL` for now).

- [x] `.env` created
- [x] `bun install` clean
- [x] `bun run build` succeeds

### 4. systemd service

`/etc/systemd/system/aslak.service`:

```ini
[Unit]
Description=CrossFit Aslak (Next.js)
After=network.target

[Service]
Type=simple
User=debian
WorkingDirectory=/home/debian/aslak-landing
Environment=PATH=/home/debian/.bun/bin:/usr/bin:/bin
EnvironmentFile=/home/debian/aslak-landing/.env
ExecStart=/home/debian/.bun/bin/bun run start -- -H 127.0.0.1 -p 3000
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now aslak
curl -I http://127.0.0.1:3000   # expect HTTP 200
```

- [x] service enabled + running (`systemctl status aslak`)
- [x] `curl -I http://127.0.0.1:3000` → 200

### 5. Caddy reverse proxy + TLS

`/etc/caddy/Caddyfile`:

```
crossfitaslak.com, www.crossfitaslak.com {
    reverse_proxy 127.0.0.1:3000
}
```

```bash
sudo systemctl reload caddy   # issues Let's Encrypt cert once DNS → VPS
```

- [x] Caddyfile in place
- [x] cert issued (`sudo journalctl -u caddy | grep -i certificate`)

### 6. `deploy.sh` (repo root, `chmod +x`)

```bash
#!/usr/bin/env bash
set -euo pipefail
cd ~/aslak-landing
git pull
~/.bun/bin/bun install --frozen-lockfile
~/.bun/bin/bun run build
sudo systemctl restart aslak
```

Passwordless sudo for the one restart command — `sudo visudo`:

```
debian ALL=(ALL) NOPASSWD: /bin/systemctl restart aslak
```

Future deploys (from Mac):

```bash
ssh debian@<VPS_IP> 'cd aslak-landing && ./deploy.sh'
```

- [ ] `deploy.sh` committed + executable
- [ ] NOPASSWD sudoers line added
- [ ] test deploy runs end-to-end without password prompt

### 7. SSH hardening — LAST (after confirming key login works)

Verify key auth first (open a **second** session, must log in with no password prompt). Then `/etc/ssh/sshd_config`:

```
PasswordAuthentication no
PermitRootLogin no
```

```bash
sudo systemctl restart ssh   # keep an existing session open; re-test a new connection
```

> Locked out? Use the OVH KVM/console from the dashboard to revert.

- [ ] key login confirmed
- [ ] password + root login disabled
- [ ] new SSH connection still works

### 8. Final verify

```bash
curl -I https://crossfitaslak.com        # 200 + valid TLS
curl -I https://www.crossfitaslak.com    # 301 → apex
```

- [ ] HTTPS live on apex
- [ ] www redirects to apex
- [ ] site loads in browser

---

## Known debt

- **Dead form** — `app/cf-form/page.tsx` `onSubmit` only `console.log`s + shows a "Formulaire envoyé !" toast. Leads are **not** captured and the toast is misleading. Don't push `/cf-form` in ads until wired. Fix options: form-to-email service (Web3Forms/Formspree, no backend) or a Next route handler (`app/api/lead/route.ts`) + email/DB.

## Later / nice-to-have

- **Auto-deploy**: GitHub Actions on push to `main` → SSH in → run the same `deploy.sh`. Store the SSH key as a repo secret.
- **Backups / snapshots**: enable OVH automated snapshots.
- **Monitoring**: uptime check on `https://crossfitaslak.com`.
