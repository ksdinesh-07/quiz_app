#!/bin/bash

echo "🚀 AWS Manual Deployment Helper"
echo "================================"

# Create timestamp for unique folder
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DEPLOY_DIR="quiz-app-aws-$TIMESTAMP"

echo "1. Creating deployment folder: $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "2. Copying application files..."
# Copy all web files
cp index.html "$DEPLOY_DIR/"
cp style.css "$DEPLOY_DIR/"
cp script.js "$DEPLOY_DIR/"
cp questions.json "$DEPLOY_DIR/"
cp README.md "$DEPLOY_DIR/" 2>/dev/null || echo "README.md (optional)"

echo "3. Creating step-by-step deployment guide..."
cat > "$DEPLOY_DIR/STEP_BY_STEP_GUIDE.md" << 'GUIDE'
# 🎯 AWS Console Deployment - Complete Visual Guide

## 📋 BEFORE YOU START
1. Have an AWS account (free tier eligible)
2. Login to: https://aws.amazon.com/console/

## 📸 STEP-BY-STEP WITH SCREENSHOTS

### STEP 1: Go to S3 Service
1. In AWS Console, search for "S3"
2. Click on "S3" under Services

### STEP 2: Create Bucket
1. Click **"Create bucket"** (orange button)
2. **Bucket name**: `quiz-app-yourname` (MUST be unique globally)
   - Example: `quiz-app-dinesh-$(date +%Y%m%d)`
3. **AWS Region**: Select `US East (N. Virginia) us-east-1`
4. **IMPORTANT**: Scroll down to "Block Public Access settings"
   - ✅ **UNCHECK** "Block all public access"
   - Check the box "I acknowledge..."
5. Click **"Create bucket"**

### STEP 3: Upload Files
1. Click your bucket name
2. Click **"Upload"** button
3. Click **"Add files"** or drag & drop ALL files from this folder
4. Select ALL files (index.html, style.css, script.js, questions.json)
5. Click **"Upload"**

### STEP 4: Enable Static Website Hosting
1. Go to **"Properties"** tab
2. Scroll down to **"Static website hosting"**
3. Click **"Edit"**
4. Select **"Enable"**
5. **Index document**: Type `index.html`
6. Click **"Save changes"**

### STEP 5: Set Public Permissions
1. Go to **"Permissions"** tab
2. Find **"Bucket policy"** section
3. Click **"Edit"**
4. Paste this policy (REPLACE `quiz-app-yourname` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::quiz-app-yourname/*"
    }
  ]
}