# Simple Node.js Backend

This is a minimal Node.js backend with two API routes, ready to deploy on Vercel.

## API Routes

- `GET /api/hello` — Returns a hello message.
- `POST /api/echo` — Echoes back the JSON body you send.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```

## Deploying to Vercel

1. [Install Vercel CLI](https://vercel.com/download) if you haven't already.
2. Deploy:
   ```bash
   vercel --prod
   ```

Vercel will use the `vercel.json` configuration to deploy the app as a serverless function.
