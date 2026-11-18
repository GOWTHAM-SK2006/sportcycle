# ==============================================================================
# SPORTCYCLE – Production Multi-Stage Dockerfile (Next.js 14 + Spring Boot 3.3)
# ==============================================================================

# STAGE 1: Build Spring Boot 3.3 / Java 21 Backend
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-build
WORKDIR /app/backend

# Cache Maven dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source and compile executable JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests

# STAGE 2: Build Next.js 14 Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./
# Ensure public directory exists
RUN mkdir -p /app/frontend/public

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# STAGE 3: Unified Production Runtime (Eclipse Temurin 21 + Node.js 20)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install Node.js 20, npm, curl, bash, and dos2unix
RUN apk add --no-cache nodejs npm libc6-compat curl bash dos2unix

# Copy Spring Boot backend artifacts
COPY --from=backend-build /app/backend/target/*.jar /app/backend/app.jar

# Copy Next.js frontend production bundle
COPY --from=frontend-build /app/frontend/package.json /app/frontend/
COPY --from=frontend-build /app/frontend/node_modules /app/frontend/node_modules
COPY --from=frontend-build /app/frontend/.next /app/frontend/.next
COPY --from=frontend-build /app/frontend/public /app/frontend/public
COPY --from=frontend-build /app/frontend/next.config.mjs /app/frontend/

# Copy startup orchestrator and ensure executable line endings
COPY start.sh /app/start.sh
RUN dos2unix /app/start.sh || sed -i -e 's/\r$//' /app/start.sh && chmod +x /app/start.sh

# Environment settings
ENV NODE_ENV=production
ENV SPRING_PROFILES_ACTIVE=prod
ENV BACKEND_PORT=8085
ENV PORT=3000

# Railway routes traffic to $PORT
EXPOSE 3000 8085

ENTRYPOINT ["/bin/sh", "/app/start.sh"]
