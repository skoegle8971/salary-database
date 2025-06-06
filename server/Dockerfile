FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy rest of the code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the app
CMD ["node", "index.js"]
