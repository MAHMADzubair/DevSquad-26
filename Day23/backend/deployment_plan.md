# Railway Deployment Plan for Backend

This plan outlines the steps to deploy your NestJS backend to Railway using the Railway CLI.

## Prerequisites
- [x] Railway CLI installed and logged in (`welcomeahmad5@gmail.com`)
- [x] `railway.json` configuration created in `backend/` folder.

## Deployment Steps

### 1. Initialize Project
Run `railway init` in the `backend` directory. If it requests a name, please provide one or it will generate a random one.

### 2. Environment Variables
You will need to set the following variables in Railway (either via UI or CLI):
- `PORT` (Usually set automatically by Railway)
- `MONGODB_URI` 
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EXPIRES_IN=1d`
- `JWT_REFRESH_EXPIRES_IN=7d`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `FRONTEND_URL` (Set this to your production frontend URL once you have it)

### 3. Deploy
Run `railway up` from the `backend` directory.

---

I've already created the `railway.json` for you:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "healthcheckPath": "/api",
    "healthcheckTimeout": 100
  }
}
```
