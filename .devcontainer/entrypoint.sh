#!/bin/bash
set -e

echo "Waiting for SQL Server to be ready on db:1433..."

# Loop until sqlcmd can successfully connect to SQL Server
until /opt/mssql-tools18/bin/sqlcmd -S db,1433 -U sa -P "Dev_Passw0rd!2026" -Q "SELECT 1" -C &> /dev/null
do
  echo "SQL Server is unavailable - sleeping 2 seconds..."
  sleep 2
>

echo "SQL Server is up and running! Starting application..."
exec "$@"