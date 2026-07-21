FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Expose port (default 3000)
EXPOSE 3000

# Default environment variables
ENV LISTEN_PORT=3000

# Start the application
CMD ["node", "app.js"]
