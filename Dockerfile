
# Base image with Node.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Install the static server 'serve'
RUN npm install -g serve

# Expose the port that 'serve' will use
EXPOSE 8080

# Command to serve the built application
CMD ["serve", "-s", "dist", "-l", "8080"]
