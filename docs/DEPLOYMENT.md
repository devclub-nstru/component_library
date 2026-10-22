# Deployment

The docs site and the registry JSON at `https://ui.devclubxnst.com` run as one Docker container on the club's VPS, behind nginx. This document covers how a deploy works, the one-time server setup, and day-to-day operation. [ARCHITECTURE.md](ARCHITECTURE.md) shows where this fits, and [SECURITY_ASSESSMENT.md](SECURITY_ASSESSMENT.md#production-hosting) covers the threats.

## How a deploy works

Every push to `main` runs the [Deploy](../.github/workflows/deploy.yml) workflow:

1. **Build and push image.** Builds the [Dockerfile](../Dockerfile) for `linux/amd64`, pushes it as `ghcr.io/devclub-nstru/component_library:<commit-sha>`, and attaches a Sigstore-signed build provenance attestation. Layers are cached in GHCR under the `buildcache` tag.
2. **Deploy to VPS.** Connects over SSH, logs the VPS in to GHCR with the job's short-lived token, and pipes [scripts/deploy-vps.sh](../scripts/deploy-vps.sh) to `bash` on the server with the image digest. The script:
   - pulls the image,
   - stops the running `devclub-ui` container and keeps it as `devclub-ui-previous`,
   - starts the new container on `127.0.0.1:3000`,
   - waits up to two minutes for the image's health check (`GET /api/health`),
   - on success removes the previous container and runs `docker image prune --all` for this project's images only (filtered by the `org.opencontainers.image.source` label, so other images on the server are left alone),
   - on failure prints the new container's logs, restores the previous container and fails the workflow.
3. **Check the public site.** Requests `https://ui.devclubxnst.com/api/health` through nginx.

The CI [Container image](../.github/workflows/ci.yml) check builds the image on every pull request and runs the same deploy script against it twice, once as a fresh install and once as an upgrade, so a broken Dockerfile or script fails before it reaches `main`.

Deploys are serialized. A new push waits for the running deploy to finish. Each deploy drops requests for the few seconds between stopping the old container and the new one accepting connections.

### Container runtime

| Setting | Value |
| --- | --- |
| Base image | `node:22-bookworm-slim`, pinned by digest and updated by Dependabot |
| Process | `node server.js` (Next.js standalone output) as the `node` user, under `--init` |
| Port | `127.0.0.1:3000` only. nginx is the only public entry point. |
| Filesystem | Read-only root, `/tmp` as tmpfs, and the `devclub-ui-cache` volume at `/app/.next/cache` for optimized images |
| Privileges | `--cap-drop ALL`, `--security-opt no-new-privileges` |
| Limits | 1 CPU, 1 GB memory, 256 processes |
| Logs | Docker `json-file`, 3 files of 10 MB |
| Restart | `unless-stopped`, so it comes back after a reboot |

To change a limit, edit `start_container` in [scripts/deploy-vps.sh](../scripts/deploy-vps.sh). The next deploy applies it.

## One-time setup

### 1. Prepare the VPS

The server needs a 64-bit x86 Linux, Docker Engine and nginx. Install Docker Engine from Docker's apt repository by following [the official guide](https://docs.docker.com/engine/install/), then create a dedicated deploy user that can run Docker and nothing else:

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
```

Membership of the `docker` group is root-equivalent, so don't reuse a personal account and don't give this user `sudo`.

### 2. Create the deploy key

On your own machine:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy@devclub-ui" -f devclub-ui-deploy -N ""
```

Install the public key on the VPS with the `restrict` option, which turns off port, agent and X11 forwarding and terminal allocation, none of which a deploy needs:

```bash
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
echo "restrict $(cat devclub-ui-deploy.pub)" | sudo tee -a /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Check that it works with `ssh -i devclub-ui-deploy deploy@<vps-ip> docker version`.

### 3. Record the host key

Get the server's host key line:

```bash
ssh-keyscan -t ed25519 <vps-ip>
```

Before trusting it, check its fingerprint matches the one the server reports for itself (`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` on the VPS) by comparing it with `ssh-keyscan -t ed25519 <vps-ip> | ssh-keygen -lf -`.

### 4. Configure GitHub

In **Settings > Environments**, create an environment named `production`:

- **Deployment branches and tags:** Selected branches, with the rule `main`. This is what keeps pull requests from reading the secrets below.
- **Environment secrets:**

  | Secret | Value |
  | --- | --- |
  | `VPS_HOST` | The VPS IP address (or hostname) |
  | `VPS_USERNAME` | `deploy` |
  | `VPS_SSH_KEY` | The full contents of the private key file `devclub-ui-deploy`, including the `BEGIN` and `END` lines |
  | `VPS_KNOWN_HOSTS` | The line printed by `ssh-keyscan` in step 3. Optional, but without it the workflow trusts whatever key the server offers and warns in every run. |

- **Environment variables (optional):** `VPS_SSH_PORT` if SSH doesn't listen on port 22.

Delete the local private key once it's saved in GitHub.

### 5. Configure nginx

Point a server block for `ui.devclubxnst.com` at the container. Buffering is off so streamed React Server Component responses reach the browser as they render:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name ui.devclubxnst.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_read_timeout 60s;
    }
}
```

Then issue a certificate with `sudo certbot --nginx -d ui.devclubxnst.com`, which adds the TLS listener and the HTTP to HTTPS redirect. Next.js already sends `Cache-Control: public, max-age=31536000, immutable` for `/_next/static/*`, so no extra cache rules are needed.

### 6. First deploy and cutover

1. Run **Actions > Deploy > Run workflow** on `main`. Until DNS moves, the final public check still reaches the old host, so also check the VPS directly: `ssh deploy@<vps-ip> curl -s http://127.0.0.1:3000/api/health`.
2. Point the `ui.devclubxnst.com` DNS record at the VPS and wait for it to propagate.
3. Disconnect the old hosting integrations so they stop posting checks on pull requests: delete the Vercel project, and remove the Cloudflare Workers Builds connection for `component-library`.

## Operating

| Task | How |
| --- | --- |
| Roll back | **Actions > Deploy > Run workflow** on `main`, with `image-tag` set to the full commit SHA of an earlier deploy. It skips the build and redeploys that image from GHCR. |
| See what's running | `docker ps --filter name=devclub-ui` and `docker inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' devclub-ui` |
| Read logs | `docker logs --tail 200 --follow devclub-ui` |
| Restart | `docker restart devclub-ui` |
| Verify an image | `gh attestation verify oci://ghcr.io/devclub-nstru/component_library:<sha> --repo devclub-nstru/component_library` |
| Run the image locally | `docker build -t devclub-ui . && docker run --rm -p 3000:3000 devclub-ui`, then open `http://localhost:3000` |
| Rotate the deploy key | Repeat step 2, replace `VPS_SSH_KEY`, then remove the old line from `/home/deploy/.ssh/authorized_keys` |

If **Build and push image** fails with `denied` on the first run, the org doesn't allow GitHub Actions to create packages yet. An org owner can allow it under the org's **Settings > Packages**. If **Deploy container** later fails to pull, check that this repository has access under the package's **Package settings > Manage Actions access**.
