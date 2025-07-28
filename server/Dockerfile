# Use an official Node.js image as the base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package.json package-lock.json* ./

RUN npm install express && npm install

# Copy the necessary files for your server application
COPY . .

# Expose the necessary port for your server application
EXPOSE 8080

# Copy the about.json file to the container

# Start your server application (replace 'app.js' with your actual entry point)
CMD ["node", "app.js"]
