# Deployment Cheat Sheet

## Vercel Deployment

### Initial Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

### Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy specific directory
vercel --prod ./dist
```

### Configuration (vercel.json)
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

### Environment Variables
```bash
# Add secret
vercel env add SUPABASE_URL

# List secrets
vercel env ls

# Pull env vars to .env.local
vercel env pull
```

## Firebase Hosting

### Initial Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init hosting
```

### Deploy
```bash
# Deploy to hosting
firebase deploy --only hosting

# Deploy with message
firebase deploy -m "Version 2.0"

# Preview before deploying
firebase hosting:channel:deploy preview
```

### Configuration (firebase.json)
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Environment Variables
```bash
# Set config
firebase functions:config:set api.key="YOUR_KEY"

# Get config
firebase functions:config:get

# Use in code
const apiKey = functions.config().api.key;
```

## AWS Amplify

### Initial Setup
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure AWS credentials
amplify configure

# Initialize project
amplify init
```

### Deploy
```bash
# Add hosting
amplify add hosting

# Publish
amplify publish

# Update and publish
amplify push
amplify publish
```

### Configuration (amplify.yml)
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Environment Variables
```bash
# Add environment variable
amplify env add

# Set variable
amplify update function
# Then add environment variables in the UI

# Access in code
const apiKey = process.env.API_KEY;
```

## AWS S3 + CloudFront

### S3 Bucket Setup
```bash
# Create bucket
aws s3 mb s3://my-app-bucket

# Enable static website hosting
aws s3 website s3://my-app-bucket \
  --index-document index.html \
  --error-document error.html

# Sync files
aws s3 sync ./dist s3://my-app-bucket \
  --delete \
  --cache-control "max-age=31536000"
```

### CloudFront Setup
```bash
# Create distribution
aws cloudfront create-distribution \
  --origin-domain-name my-app-bucket.s3.amazonaws.com \
  --default-root-object index.html

# Invalidate cache after deployment
aws cloudfront create-invalidation \
  --distribution-id ABCDEF123456 \
  --paths "/*"
```

## CI/CD Integration

### GitHub Actions for Vercel
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitHub Actions for Firebase
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### GitHub Actions for AWS Amplify
```yaml
name: Deploy to Amplify
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: |
          npm install -g @aws-amplify/cli
          amplify push --yes
```

## Best Practices

### Performance Optimization
1. Enable compression (gzip/brotli)
2. Set appropriate cache headers
3. Use CDN for static assets
4. Optimize images (WebP, lazy loading)
5. Enable HTTP/2

### Security Headers
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Environment Management
- Development: `.env.local`
- Staging: `.env.staging`
- Production: Platform environment variables
- Never commit `.env` files

### Deployment Checklist
- [ ] Run tests: `npm test`
- [ ] Build locally: `npm run build`
- [ ] Check bundle size
- [ ] Update environment variables
- [ ] Test on staging first
- [ ] Monitor after deployment

## Quick Commands

```bash
# Vercel
vercel --prod

# Firebase
firebase deploy --only hosting

# AWS Amplify
amplify publish

# AWS S3
aws s3 sync ./dist s3://bucket-name --delete
```