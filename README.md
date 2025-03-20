# MySQL CRUD - Node.js, React.js

This application allows users to perform CRUD (Create, Read, Update, Delete) operations on user data, including storing the name and email of users, each with a specific ID. The stack consists of:

- **MySQL** as the database
- **Express.js** for handling server-side logic
- **React.js** for building the frontend UI
- **Node.js** as the server-side runtime environment

The project is set up to run locally using **Docker** and **Docker Compose** for containerization, **Kubernetes** for orchestration, and **Helm** for managing Kubernetes resources.

## Project Structure

- **docker/**: Contains the `Dockerfile` for each component (frontend, backend, MySQL).
- **docker-compose.yml**: Defines the services for frontend, backend, and MySQL, setting up the environment for local development using Docker.
- **k8s/**: Contains Kubernetes YAML files for deploying the application in a Kubernetes cluster.
- **helm/**: Contains separate Helm charts for the frontend, backend, and MySQL, along with a **single-parent Helm chart** (`helm-three-tier-app`) that installs all components together.

## Running the Project Locally

To run the project on your local machine, follow the steps below:

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone <repository_url>
```

### 2. Navigate to Project Directory
Move into the project directory:
```bash
cd <project_directory>
```
### 3. Install Dependencies
First, install the dependencies for the backend and frontend:

#### Frontend
Navigate to the frontend directory and run the following:

```bash
cd frontend
npm install
```

#### Backend
Navigate to the backend directory and run:

```bash
cd backend
npm install
```

### 4. Setup Environment Variables
Create a .env file in the root of your project directory and add the variables given in .env.sample (for MySQL connection, API URL, etc.).

### 5. Run the Development Server
Start the backend and frontend servers:

#### Frontend
```bash
cd frontend
npm start
```

#### Backend
```bash
cd backend
npm start
```

### 6. Access the App Locally
Frontend: Open your web browser and navigate to http://localhost:3000.
Backend: The backend API will be available at http://localhost:5000.
The app should now be running locally on your machine, connected to your MySQL database using the environment variables specified in the .env file.

### 7. Docker Setup (Optional)
To run the application using Docker and Docker Compose, you can use the provided docker-compose.yml file.

#### Build and Start Containers
From the root of the project directory, run:

```bash
docker-compose up --build
```
This will start the frontend, backend, and MySQL containers.

#### Access the App
Frontend: Open http://localhost:3000.
Backend: Open http://localhost:5000.
### 8. Kubernetes Setup (Optional)
To deploy the application using Kubernetes, use the configuration files in the k8s/ folder.

#### Deploy the Application
```bash
kubectl apply -f k8s/
```
Access the App
Once the pods are running, you can use kubectl get services to find the LoadBalancer's IP or use port forwarding to access the services.

### 9. Helm Chart Setup (Optional)
Helm charts are used to deploy the frontend, backend, and MySQL components to Kubernetes. You can either deploy them separately or use the single-parent Helm chart to deploy the entire stack.

Deploy Using the Parent Helm Chart
```bash
cd helm
helm install helm-three-tier-app .
```
This will install all the components (frontend, backend, and MySQL) using the Helm charts.

#### Deploy Individual Components
If you want to deploy only one component (e.g., the frontend), you can install its individual Helm chart. For example:

```bash
helm install frontend ./frontend
helm install backend ./backend
helm install mysql ./mysql
```

