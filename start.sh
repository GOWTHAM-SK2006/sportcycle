#!/bin/sh
set -e

echo "========================================================"
echo " SPORTCYCLE – Gear. Play. Repeat. (Enterprise Platform)"
echo "========================================================"

# 1. Start Java 21 Spring Boot Backend in background on internal port 8080
echo ">> [1/3] Launching Java 21 Spring Boot Backend on 127.0.0.1:8080..."
java -Dserver.port=8080 -Djava.security.egd=file:/dev/./urandom -jar /app/backend/app.jar &
BACKEND_PID=$!

# 2. Wait up to 35 seconds for Spring Boot and Supabase connection
echo ">> [2/3] Waiting for Spring Boot & Supabase Database initialization..."
READY=0
for i in $(seq 1 35); do
  if curl -s http://127.0.0.1:8080/api/v1/sports > /dev/null 2>&1; then
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
echo ">> [3/3] Launching Next.js 14 Frontend on public PORT $PUBLIC_PORT..."
cd /app/frontend
export PORT=$PUBLIC_PORT
exec npm start
