FROM mcr.microsoft.com/devcontainers/dotnet:1-10.0

# Node.js, downloaded directly. It skips apt, so the broken Yarn repo key can't fail the build.
ARG NODE_VERSION=22.11.0
RUN curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" \
    | tar -xz -C /usr/local --strip-components=1 \
    && node -v && npm -v

# dotnet-ef that matches whatever .NET runtime this image contains
USER vscode
RUN RT="$(dotnet --list-runtimes | awk '/Microsoft.NETCore.App/ {print $2}' | tail -1)" \
    && (dotnet tool install --global dotnet-ef --version "$RT" || dotnet tool install --global dotnet-ef)
ENV PATH="${PATH}:/home/vscode/.dotnet/tools"
USER root