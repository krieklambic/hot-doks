#!/bin/bash

# Variables definition
app='hot-doks-app'
port=80
env=${1:-test}
version=${2:-'1.0.0-SNAPSHOT'}
revision=$(git rev-parse --short HEAD)


# Set gcloud configuration
gcloud config set project comexis-$env
gcloud config set container/cluster hs-$env-cluster
gcloud container clusters get-credentials hs-$env-cluster

echo
echo  ---- Deploying $app:$version-$revision to $env environment ---
echo

#Building the image
gcloud builds submit --config cloudbuild.yaml --substitutions=_APP_NAME=$app,_ENVIRONMENT=$env,_VERSION=$version .

#Add the latest tag
gcloud container images add-tag gcr.io/comexis-$env/$app:$version gcr.io/comexis-$env/$app:latest --quiet

#Update the service with the new image
kubectl set image deployment/$app $app=gcr.io/comexis-$env/$app:latest -n=apps

kubectl rollout restart deployment $app -n=apps
