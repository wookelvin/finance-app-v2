#!/bin/bash

# Deploy pre-built Finance App to Digital Ocean Droplet
set -e

# Configuration
REMOTE_HOST="kwoo-cloud-1"
REMOTE_PATH="/opt/finance-app"
IMAGE_NAME="finance-app"
IMAGE_TAG="latest"

echo "🚀 Starting pre-built deployment to Digital Ocean..."

# Build Docker image locally
echo "🔨 Building Docker image locally..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

# Save Docker image to tar file
echo "📦 Saving Docker image to file..."
rm -f finance-app-image.tar
docker save -o finance-app-image.tar ${IMAGE_NAME}:${IMAGE_TAG}

# Compress the image for faster transfer
echo "🗜️ Compressing image..."
rm -f finance-app-image.tar.gz
gzip finance-app-image.tar

# Copy image to server
echo "📤 Uploading Docker image to server..."
ssh $REMOTE_HOST "sudo mkdir -p $REMOTE_PATH && sudo chown $(whoami):$(whoami) $REMOTE_PATH"
scp finance-app-image.tar.gz $REMOTE_HOST:$REMOTE_PATH/

# Copy docker-compose file and any other needed files
echo "📋 Uploading configuration files..."
scp docker-compose.prebuilt.yml $REMOTE_HOST:$REMOTE_PATH/
scp -r prisma $REMOTE_HOST:$REMOTE_PATH/

# Deploy on server
echo "🔧 Deploying on server..."
ssh $REMOTE_HOST << EOF
    cd $REMOTE_PATH
    
    # Stop existing containers
    sudo docker compose -f docker-compose.prebuilt.yml down || true
    
    # Load the new image
    echo "📥 Loading Docker image..."
    gunzip finance-app-image.tar.gz
    sudo docker load -i finance-app-image.tar
    rm finance-app-image.tar
    
    # Create data directory
    sudo mkdir -p data
    
    # Start containers (no build needed!)
    sudo docker compose -f docker-compose.prebuilt.yml up -d
    
    # Clean up old images
    sudo docker image prune -f
    
    echo "✅ Deployment complete!"
    echo "📊 Container status:"
    sudo docker compose -f docker-compose.prebuilt.yml ps
EOF

# Clean up local files
rm -f finance-app-image.tar.gz

echo "🎉 Pre-built deployment to Digital Ocean completed successfully!"
echo "🌐 Your app should be accessible at: http://kwoo-cloud-1:7654"