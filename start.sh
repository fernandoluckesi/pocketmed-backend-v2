#!/bin/sh
set -e

echo "=== PocketMed API Starting ==="
echo "NODE_ENV: ${NODE_ENV:-not set}"
echo "DB_HOST: ${DB_HOST:-not set}"
echo "PORT: ${PORT:-3000}"

# Wait for the database to be reachable before running migrations
if [ -n "$DB_HOST" ] || [ -n "$MYSQL_HOST" ]; then
  HOST="${DB_HOST:-$MYSQL_HOST}"
  PORT_DB="${DB_PORT:-3306}"
  echo "Waiting for database at ${HOST}:${PORT_DB}..."
  MAX_TRIES=30
  TRIES=0
  until nc -z "$HOST" "$PORT_DB" 2>/dev/null; do
    TRIES=$((TRIES + 1))
    if [ "$TRIES" -ge "$MAX_TRIES" ]; then
      echo "WARNING: Database not reachable after ${MAX_TRIES} attempts, continuing anyway..."
      break
    fi
    echo "  Attempt ${TRIES}/${MAX_TRIES} — waiting 2s..."
    sleep 2
  done
  echo "Database is reachable (or timeout reached). Running migrations..."
  node dist/database/run-migrations.js || {
    echo "WARNING: Migrations failed, continuing anyway..."
  }
else
  echo "WARNING: No DB_HOST configured, skipping migrations"
fi

echo "Starting application..."
exec node dist/main
