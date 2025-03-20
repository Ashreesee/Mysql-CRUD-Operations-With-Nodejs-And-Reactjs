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
