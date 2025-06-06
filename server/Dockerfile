# Use Node.js LTS version
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port 3001
EXPOSE 3001

# Command to run the app
CMD ["node","index.js"]
