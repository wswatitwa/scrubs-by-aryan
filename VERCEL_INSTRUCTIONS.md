# Deploying to Vercel

Vercel is the recommended platform for deploying Vite/React applications.

## Option 1: Import from GitHub (Recommended)

1.  **Push your latest code** to GitHub.
    ```bash
    git push origin main
    ```
2.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
3.  Click **"Add New..."** -> **"Project"**.
4.  Select your repository (`scrubs-by-aryan`).
5.  **Configure Project**:
    - **Framework Preset**: Vite (should be auto-detected).
    - **Root Directory**: `./` (default).
    - **Build Command**: `npm run build` (default).
    - **Output Directory**: `dist` (default).
6.  **Environment Variables**:
    - Expand the "Environment Variables" section.
    - Add the following variable:
        - **Key**: `VITE_API_KEY`
        - **Value**: `AIzaSyAeH-qBkRava1A5bCyil6NZ1WNLzFRyhO8`
7.  Click **"Deploy"**.

## Option 2: Using Vercel CLI

If you have valid Vercel credentials and the CLI installed:

1.  Install Vercel CLI:
    ```bash
    npm i -g vercel
    ```
2.  Run deployment command:
    ```bash
    vercel
    ```
3.  Follow the prompts. when asked "Want to modify these settings?", answer **N** (No) unless you know what you are doing.
4.  **Important**: You must add the environment variable in the Vercel Project Settings on the website, OR pull envs, OR deploy with envs.
    - Simplest way via CLI for prod:
      ```bash
      vercel --prod --build-env VITE_API_KEY=AIzaSyAeH-qBkRava1A5bCyil6NZ1WNLzFRyhO8
      ```

## Single Page Application (SPA) Routing
A `vercel.json` file has been added to the project root. This ensures that if a user refreshes the page on a route like `/category/apparel`, they won't get a 404 error.
