# Deploying to Google Cloud Run

Since your environment (or this agent's environment) doesn't have `gcloud` or `docker` installed/authenticated, you will need to run the deployment from your local machine or Google Cloud Shell.

## Prerequisites
1.  **Google Cloud Project**: You need an active project.
2.  **gcloud CLI**: Installed and authenticated (`gcloud auth login`).
3.  **Docker**: Installed and running (if deploying from local machine).

## Steps

1.  **Open Terminal/PowerShell** in the project folder.
2.  **Edit `deploy_cloud_run.ps1`**:
    - Open the file and replace `YOUR_PROJECT_ID_HERE` with your actual Google Cloud Project ID.
    - You can verify your project ID by running `gcloud projects list`.
3.  **Run the script**:
    ```powershell
    .\deploy_cloud_run.ps1
    ```

## Alternative: Using Cloud Shell
If you don't have Docker/gcloud locally:
1.  Go to the [Google Cloud Console](https://console.cloud.google.com).
2.  Open **Cloud Shell** (terminal icon in top right).
3.  Clone your repo: `git clone https://github.com/wswatitwa/scrubs-by-aryan.git`
4.  Navigate: `cd scrubs-by-aryan`
5.  Create the `.env` file or export the key:
    ```bash
    export VITE_API_KEY=AIzaSyAeH-qBkRava1A5bCyil6NZ1WNLzFRyhO8
    ```
6.  Use Cloud Build (doesn't require local Docker):
    ```bash
    gcloud builds submit --tag gcr.io/$DEVSHELL_PROJECT_ID/crubs-app --build-arg VITE_API_KEY=$VITE_API_KEY .
    gcloud run deploy crubs-app --image gcr.io/$DEVSHELL_PROJECT_ID/crubs-app --platform managed --region us-central1 --allow-unauthenticated
    ```
