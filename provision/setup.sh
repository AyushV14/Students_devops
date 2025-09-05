#!/usr/bin/env bash

# Exit on error
set -e

echo "🚀 Updating packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "🐳 Installing Docker..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"

sudo apt-get update -y
sudo apt-get install -y docker-ce

echo "⚡ Adding vagrant user to docker group..."
sudo usermod -aG docker vagrant

echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "✅ Docker & Docker Compose installed!"
docker --version
docker-compose --version
