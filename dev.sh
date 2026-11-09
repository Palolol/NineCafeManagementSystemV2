#!/usr/bin/env bash
cd "$(dirname "$0")"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
trap 'kill 0' INT TERM EXIT

(cd NineCafeApi/NineCafeApi && ASPNETCORE_ENVIRONMENT=Development \
  dotnet run --no-launch-profile --urls "http://0.0.0.0:5256") &

(cd Frontend && npm run dev) &

wait