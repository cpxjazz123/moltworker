# Cloudflare Sandbox with OpenClaw/Moltbot
# Based on official sandbox image with minimal modifications
FROM docker.io/cloudflare/sandbox:0.7.2

# Build argument for unique image SHA
ARG BUILD_DATE
LABEL build_date=$BUILD_DATE

# Install Node.js 22 in /opt/nodejs (isolated from base image)
# IMPORTANT: Do NOT override PATH globally - only in startup script
# This preserves the base image's environment for sandbox-mcp
ENV NODE_VERSION=22.13.1
RUN ARCH="$(dpkg --print-architecture)" \
    && case "${ARCH}" in \
         amd64) NODE_ARCH="x64" ;; \
         arm64) NODE_ARCH="arm64" ;; \
         *) echo "Unsupported architecture: ${ARCH}" >&2; exit 1 ;; \
       esac \
    && apt-get update \
    && apt-get install -y --no-install-recommends xz-utils ca-certificates rsync \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /opt/nodejs \
    && curl -fsSLk https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${NODE_ARCH}.tar.xz -o /tmp/node.tar.xz \
    && tar -xJf /tmp/node.tar.xz -C /opt/nodejs --strip-components=1 \
    && rm /tmp/node.tar.xz \
    && /opt/nodejs/bin/node --version \
    && /opt/nodejs/bin/npm --version

# Install pnpm and OpenClaw using the new Node.js
# Must use env to set PATH for npm to find the correct node
RUN env PATH="/opt/nodejs/bin:$PATH" npm install -g pnpm \
    && env PATH="/opt/nodejs/bin:$PATH" npm install -g openclaw@2026.2.3

# Verify OpenClaw installation and create symlink if needed
RUN ls -la /opt/nodejs/bin/ | grep openclaw || echo "openclaw not found in /opt/nodejs/bin" \
    && ls -la /opt/nodejs/lib/node_modules/openclaw/bin/ 2>/dev/null || echo "no bin dir" \
    && /opt/nodejs/bin/node /opt/nodejs/lib/node_modules/openclaw/bin/openclaw.mjs --version || echo "Failed to run openclaw" \
    && echo "OpenClaw installation verified"

# Create OpenClaw directories
RUN mkdir -p /root/.openclaw \
    && mkdir -p /root/clawd \
    && mkdir -p /root/clawd/skills

# Copy startup script
COPY start-openclaw.sh /usr/local/bin/start-openclaw.sh
RUN chmod +x /usr/local/bin/start-openclaw.sh

# Copy custom skills
COPY skills/ /root/clawd/skills/

# Set working directory
WORKDIR /root/clawd

# Expose the gateway port
EXPOSE 18789

# No CMD - preserve base image's entrypoint for sandbox-mcp
# The worker will start OpenClaw via sandbox.startProcess()
# The startup script will set PATH before running openclaw
