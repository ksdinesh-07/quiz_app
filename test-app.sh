#!/bin/bash
echo "Testing Quiz App..."
echo "==================="

# Clean up
docker-compose down 2>/dev/null
docker stop test-app 2>/dev/null
docker rm test-app 2>/dev/null

# Build
echo "1. Building images..."
docker build -t quiz-app-node .
docker build -t quiz-app-nginx -f Dockerfile.nginx .

# Test different ports
echo "2. Testing on port 5000..."
docker run -d -p 5000:3000 --name test-app quiz-app-node
sleep 3
curl -s http://localhost:5000 && echo "✅ Port 5000 working" || echo "❌ Port 5000 failed"

echo "3. Testing on port 5001..."
docker stop test-app 2>/dev/null
docker rm test-app 2>/dev/null
docker run -d -p 5001:80 --name test-app quiz-app-nginx
sleep 2
curl -s http://localhost:5001 && echo "✅ Port 5001 working" || echo "❌ Port 5001 failed"

# Cleanup
docker stop test-app
docker rm test-app
echo "==================="
echo "Test complete!"
