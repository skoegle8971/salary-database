# Dockerfile

FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy root package.json to install concurrently
COPY package.json ./
RUN npm install

# Copy both client and server folders
COPY client ./client
COPY server ./server

# Install client and server dependencies
RUN npm --prefix client install
RUN npm --prefix server install

# Expose ports for Vite and Express
EXPOSE 5173
EXPOSE 3000

# Start both frontend and backend
CMD ["npm", "run", "dev"]
