gcloud config set project comexis-test

gcloud container clusters get-credentials hs-kafka-cluster --region <REGION>

kubectl apply -f deployment.yaml
kubectl apply -f service.yaml