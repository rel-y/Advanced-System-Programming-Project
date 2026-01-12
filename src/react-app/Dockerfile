# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for faster rebuilds)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the default React dev server port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
