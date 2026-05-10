#!/bin/sh

echo "=== PocketMed API Starting ==="
echo "NODE_ENV: ${NODE_ENV:-not set}"
echo "DB_HOST: ${DB_HOST:-not set}"
echo "MYSQLHOST: ${MYSQLHOST:-not set}"
echo "PORT: ${PORT:-3000}"

# Detect DB host from any supported env var name
DB_CONFIGURED=""
if [ -n "$DB_HOST" ] && [ "$DB_HOST" != "localhost" ]; then
  DB_CONFIGURED="yes"
fi
if [ -n "$MYSQL_HOST" ]; then
  DB_CONFIGURED="yes"
fi
if [ -n "$MYSQLHOST" ]; then
  DB_CONFIGURED="yes"
fi

if [ -n "$DB_CONFIGURED" ]; then
  echo "Running database migrations..."
  node dist/database/run-migrations.js || echo "WARNING: Migrations failed, continuing..."
else
  echo "WARNING: No remote DB configured, skipping migrations"
fi

echo "Starting application..."
exec node dist/main
