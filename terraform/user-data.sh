#!/bin/bash
# Simple EC2 setup for OhnoMovies - Ubuntu 22.04 LTS

set -e
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "Starting setup at $(date)"

# Update system
apt-get update
apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Create app directory
mkdir -p /opt/ohnomovies/app
chown -R ubuntu:ubuntu /opt/ohnomovies

# Create deployment script
cat > /opt/ohnomovies/deploy.sh << 'EOF'
#!/bin/bash
set -e
cd /opt/ohnomovies/app
docker-compose pull
docker-compose down
docker-compose up -d
docker image prune -af
echo "Deployment complete!"
EOF

chmod +x /opt/ohnomovies/deploy.sh

# Simple firewall
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 4001/tcp  # Backend API
ufw allow 8080/tcp  # Frontend
ufw allow 3307/tcp  # MySQL (if needed externally)

echo "Setup completed at $(date)"
