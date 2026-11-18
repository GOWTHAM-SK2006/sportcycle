# ==========================================
# SPORTCYCLE Backend - Production Dockerfile for Railway
# ==========================================

# Stage 1: Build Java 21 Spring Boot Application
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy Maven descriptor and cache dependencies offline
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy backend source code and build production JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Alpine Runner
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built executable JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Railway automatically assigns PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Run Spring Boot binding to Railway's assigned PORT
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dserver.port=${PORT}", "-jar", "app.jar"]

