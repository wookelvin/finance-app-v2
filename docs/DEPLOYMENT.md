# Digital Ocean Deployment Guide

This guide explains how to deploy your Finance App to your Digital Ocean droplet.

## Prerequisites

- Digital Ocean droplet with Docker installed
- SSH access configured: `root@kwoo-cloud-1`
- Local Docker installation (optional, for testing)

## Server Setup (One-time)

First, prepare your Digital Ocean server:

```bash
# SSH into your server
ssh root@kwoo-cloud-1

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker Compose (if not already installed)
sudo apt install docker-compose-plugin -y

# Create application directory
mkdir -p /opt/finance-app
cd /opt/finance-app

# Create data directory for persistent database
mkdir -p data

# Set proper permissions
chown -R root:root /opt/finance-app
```

## Deployment Commands

### Full Deployment
For the first deployment or major changes:

```bash
npm run deploy
```

This will:
- Build your application locally
- Create a deployment package
- Upload files to your server
- Build Docker image on the server
- Start the application

### Quick Deployment
For quick code updates:

```bash
npm run deploy:quick
```

This is faster and only uploads changed files.

### Server Management

Check application status:
```bash
npm run server:status
```

View application logs:
```bash
npm run server:logs
```

Restart the application:
```bash
npm run server:restart
```

SSH into your server:
```bash
npm run server:ssh
```

## Manual Docker Commands

If you prefer to run commands manually on the server:

```bash
# SSH into server
ssh root@kwoo-cloud-1

# Navigate to app directory
cd /opt/finance-app

# View container status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart application
docker compose -f docker-compose.prod.yml restart

# Stop application
docker compose -f docker-compose.prod.yml down

# Start application
docker compose -f docker-compose.prod.yml up -d

# Rebuild and start
docker compose -f docker-compose.prod.yml up -d --build
```

## Accessing Your Application

Once deployed, your application will be available at:
- **URL**: `http://kwoo-cloud-1:7654`
- **Port**: 7654

Make sure port 7654 is open in your Digital Ocean firewall settings.

## Database

The application uses SQLite with persistent storage in the `/opt/finance-app/data` directory on your server. The database will persist between deployments and container restarts.

## Troubleshooting

### Port Issues
If port 7654 is not accessible, check your firewall:

```bash
# On your Digital Ocean server
sudo ufw allow 7654
sudo ufw status
```

### Container Issues
If containers fail to start:

```bash
# Check Docker status
sudo systemctl status docker

# Check container logs
docker compose -f docker-compose.prod.yml logs

# Rebuild containers
docker compose -f docker-compose.prod.yml up -d --build --force-recreate
```

### SSH Issues
If SSH connection fails:

1. Verify your server IP/hostname
2. Check SSH key configuration
3. Ensure port 22 is open

## Environment Variables

The production environment uses these variables (configured in docker-compose.prod.yml):

- `NODE_ENV=production`
- `PORT=7654`
- `HOST=0.0.0.0`
- `DATABASE_URL=file:./data/prod.db`

## Security Notes

1. Consider setting up a non-root user for deployment
2. Configure UFW firewall properly
3. Use SSH keys instead of passwords
4. Regularly update your server packages
5. Consider using a reverse proxy (nginx) for production

## Next Steps

1. Run your first deployment: `npm run deploy`
2. Test your application at `http://kwoo-cloud-1:7654`
3. Set up a domain name (optional)
4. Configure SSL/HTTPS (recommended for production)