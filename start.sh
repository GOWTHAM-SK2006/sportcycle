#!/bin/sh
set -e

echo "========================================================"
echo " SPORTCYCLE – Gear. Play. Repeat. (Unified Platform)"
echo "========================================================"

# Internal backend port (isolated from Railway's dynamic public $PORT)
INTERNAL_BACKEND_PORT=${BACKEND_PORT:-8085}

# 1. Start Java 21 Spring Boot Backend in background on internal port
echo ">> [1/3] Launching Java 21 Spring Boot Backend on 127.0.0.1:${INTERNAL_BACKEND_PORT}..."
java -Dserver.port=${INTERNAL_BACKEND_PORT} -Djava.security.egd=file:/dev/./urandom -jar /app/backend/app.jar &
BACKEND_PID=$!

# 2. Wait up to 35 seconds for Spring Boot and Supabase connection
echo ">> [2/3] Waiting for Spring Boot & Supabase Database initialization..."
READY=0
for i in $(seq 1 35); do
  if curl -s http://127.0.0.1:${INTERNAL_BACKEND_PORT}/api/v1/status > /dev/null 2>&1; then
    echo ">> [OK] Spring Boot Backend is UP and connected to Supabase PostgreSQL!"
    READY=1
    break
  fi
  sleep 1
done

if [ $READY -eq 0 ]; then
  echo ">> [WARN] Backend startup took longer than 35s. Proceeding to launch Next.js..."
fi

# 3. Start Next.js Frontend on Railway's assigned public $PORT
PUBLIC_PORT=${PORT:-3000}
echo ">> [3/3] Launching Next.js 14 Frontend on 0.0.0.0:${PUBLIC_PORT}..."
cd /app/frontend
exec ./node_modules/.bin/next start -H 0.0.0.0 -p ${PUBLIC_PORT}
