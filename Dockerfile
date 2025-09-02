# Stage 1: Build
FROM node:20-alpine AS builder
# Set working directory
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install ALL dependencies (including dev dependencies for testing)
RUN npm install
# Copy source code
COPY src ./src
COPY migrations ./migrations
COPY tests ./tests
COPY .eslintrc.json ./

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install only production dependencies
RUN npm install --production
# Copy source code
COPY --from=builder /app/src ./src
COPY --from=builder /app/migrations ./migrations
# Expose port
EXPOSE 3000
# Start server
CMD ["node", "src/index.js"]

# Stage 3: Development/Testing (includes dev dependencies)
FROM builder AS development
WORKDIR /app
# This stage has all dependencies including Jest and the tests directory
CMD ["npm", "start"]
