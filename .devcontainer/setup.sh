#!/usr/bin/env bash
# dotnet-ef pinned to the runtime in this container
dotnet tool uninstall --global dotnet-ef >/dev/null 2>&1
dotnet tool install --global dotnet-ef --version 10.0.0-rc.2.25502.107 || echo "dotnet-ef install failed"

# Node.js through nvm
if [ ! -s "$HOME/.nvm/nvm.sh" ]; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
fi
. "$HOME/.nvm/nvm.sh"
nvm install --lts

# frontend packages
(cd Frontend && npm install)