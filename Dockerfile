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

# Install pnpm and OpenClaw using the new Node.js (temporary PATH override for install only)
# NOTE: Using absolute path instead of PATH override
RUN /opt/nodejs/bin/npm install -g pnpm \
    && /opt/nodejs/bin/npm install -g openclaw@2026.2.3 \
    && /opt/nodejs/bin/openclaw --version

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
