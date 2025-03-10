# Use a base Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the correct port
EXPOSE 5000

# Start the development server
CMD ["npm", "run", "dev", "--", "--host=0.0.0.0", "--port=5000"]
