# Ensure you are in the project root directory
cd ..

# Build the Docker image
docker build -t gcr.io/comexis-test/hot-doks-api:latest .

# Authenticate Docker with GCR
gcloud auth configure-docker

# Push the Docker image to Google Container Registry
docker push gcr.io/comexis-test/hot-doks-api:latest

# Verify the image is in GCR
gcloud container images list