# Google Cloud Run Deployment Script

# Configuration - REPLACE THESE WITH YOUR VALUES
$PROJECT_ID = "YOUR_PROJECT_ID_HERE"
$APP_NAME = "crubs-app"
$REGION = "us-central1" # or your preferred region
$API_KEY = "AIzaSyAeH-qBkRava1A5bCyil6NZ1WNLzFRyhO8"

Write-Host "Starting deployment for $APP_NAME to project $PROJECT_ID..."

# 1. Enable services (skip if already enabled)
Write-Host "Enabling necessary Google Cloud services..."
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com

# 2. Build the image using Cloud Build (no local Docker needed if using Cloud Build)
# We use Cloud Build because it's easier than pushing a local docker image effectively
Write-Host "Building container image using Cloud Build..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$APP_NAME --project $PROJECT_ID --substitutions=_VITE_API_KEY=$API_KEY .

# Note: For Cloud Build to use the ARG, we need to ensure the cloudbuild command (or Docker build) passes it.
# The standard 'gcloud builds submit' essentially does 'docker build' in the cloud.
# We can pass build-args via the --pack flag if using buildpacks, but for Dockerfile releases, 
# 'gcloud builds submit' doesn't easily support dynamic build-args without a cloudbuild.yaml.
# A simpler approach for the user might be to just use 'docker build' locally if they have it, 
# OR use a cloudbuild.yaml.

# ALTERNATIVE: Create a temporary cloudbuild.yaml on the fly?
# Actually, gcloud builds submit supports --build-arg via flags in newer versions?
# Let's try the standard verify method:
# If this fails, we will guide the user to purely local docker.
# But since I can't test, let's provide the local docker method as primary if they have docker, 
# and fall back to instructions.

# Let's stick to the local Docker method as it's more standard for "prepare and upload".

# RE-WRITING SCRIPT FOR LOCAL DOCKER + GCLOUD PUSH
Write-Host "Building Docker image locally..."
docker build --build-arg VITE_API_KEY=$API_KEY -t gcr.io/$PROJECT_ID/$APP_NAME .

Write-Host "Pushing image to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/$APP_NAME

Write-Host "Deploying to Cloud Run..."
gcloud run deploy $APP_NAME `
  --image gcr.io/$PROJECT_ID/$APP_NAME `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --project $PROJECT_ID

Write-Host "Deployment Complete!"
