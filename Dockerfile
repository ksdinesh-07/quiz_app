# Simple Dockerfile without package.json dependency
FROM node:18-alpine

# Install serve directly
RUN npm install -g serve@14.0.0

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Expose port (internal container port)
EXPOSE 3000

# Start the server
CMD ["serve", "-s", ".", "-l", "3000"]