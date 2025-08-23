# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY src ./src
COPY migrations ./migrations

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy dependencies and source from builder stage
COPY --from=builder /app ./

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "src/index.js"]
