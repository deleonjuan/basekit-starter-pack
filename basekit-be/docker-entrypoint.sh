#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
node_modules/.bin/typeorm migration:run -d dist/database/datasource.js

echo "[entrypoint] Starting application..."
exec "$@"
