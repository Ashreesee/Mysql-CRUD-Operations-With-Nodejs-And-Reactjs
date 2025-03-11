# Use the official Node.js LTS image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the application's port
EXPOSE 3000

# Wait for the database to be ready before starting the app
CMD ["sh", "-c", "until nc -z -v -w30 $DB_HOST 3306; do echo 'Waiting for database...'; sleep 5; done && node index.js"]
