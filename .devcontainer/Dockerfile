FROM mcr.microsoft.com/devcontainers/dotnet:1-10.0

# Remove the broken Yarn repository to prevent apt-get update GPG errors during feature installation
RUN rm -f /etc/apt/sources.list.d/yarn.list \
    && rm -f /etc/apt/trusted.gpg.d/yarn.gpg || true

# Node.js installation
ARG NODE_VERSION=22.11.0
RUN curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" \
    | tar -xz -C /usr/local --strip-components=1 \
    && node -v && npm -v

# Install Docker CLI binaries directly (bypasses apt repo issues)
ARG DOCKER_VERSION=27.3.1
RUN curl -fsSL "https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz" \
    | tar -xz -C /tmp \
    && mv /tmp/docker/docker /usr/local/bin/ \
    && rm -rf /tmp/docker

# Install Docker Compose CLI plugin
RUN mkdir -p /usr/local/lib/docker/cli-plugins \
    && curl -SL "https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose \
    && chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# dotnet-ef installation
USER vscode
RUN RT="$(dotnet --list-runtimes | awk '/Microsoft.NETCore.App/ {print $2}' | tail -1)" \
    && (dotnet tool install --global dotnet-ef --version "$RT" || dotnet tool install --global dotnet-ef)
ENV PATH="${PATH}:/home/vscode/.dotnet/tools"
USER root

CMD ["sleep", "infinity"]