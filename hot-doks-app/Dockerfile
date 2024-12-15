# Use an official base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the application's port (update to match your app's port)
EXPOSE 8080

# Run the application
CMD ["npm", "start"]