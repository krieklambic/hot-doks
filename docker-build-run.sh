#!/bin/bash

# Exit on any error
set -e

#Get latest version from git
git pull
echo "🔨 Building Docker images..."

# Stop and remove existing containers if they exist
docker rm -f hot-doks-api hot-doks-app 2>/dev/null || true

# Stop and remove existing images if they exist
docker rmi -f hot-doks-api hot-doks-app 2>/dev/null || true

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

# Create a network for the containers if it doesn't exist
docker network create hot-doks-network 2>/dev/null || true

# Run the API container
echo "Starting API container..."
docker run -d \
    --name hot-doks-api \
    --network hot-doks-network \
    -p 8080:8080 \
    hot-doks-api

# Run the App container
echo "Starting App container..."
docker run -d \
    --name hot-doks-app \
    --network hot-doks-network \
    -p 80:3000 \
    -e API_BASE_URL=http://lcalhost:8080 \
    -e NODE_ENV=production \
    hot-doks-app

echo "✅ Containers are up and running!"
echo "API is available at http://localhost:8080"
echo "App is available at http://localhost"

# Show running containers
echo "\n📊 Running containers:"
docker ps
