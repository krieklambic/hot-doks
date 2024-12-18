#!/bin/bash

# Exit on any error
set -e

echo "🔨 Building Docker images..."

# Build the API image
echo "Building API image..."
cd hot-doks-api
# Check if JAR exists
if [ ! -f "target/hot-doks-api-0.0.1-SNAPSHOT.jar" ]; then
    echo "❌ API JAR file not found. Please build the Spring Boot project first."
    exit 1
fi
docker build -t hot-doks-api .

# Build the App image
echo "Building App image..."
cd ../hot-doks-app
docker build -t hot-doks-app .

echo "🚀 Starting containers..."

# Stop and remove existing containers if they exist
docker rm -f hot-doks-api hot-doks-app 2>/dev/null || true

# Run the API container
echo "Starting API container..."
docker run -d \
    --name hot-doks-api \
    -p 8080:8080 \
    hot-doks-api

# Run the App container
echo "Starting App container..."
docker run -d \
    --name hot-doks-app \
    -p 3000:3000 \
    hot-doks-app

echo "✅ Containers are up and running!"
echo "API is available at http://localhost:8080"
echo "App is available at http://localhost:3000"

# Show running containers
echo "\n📊 Running containers:"
docker ps
