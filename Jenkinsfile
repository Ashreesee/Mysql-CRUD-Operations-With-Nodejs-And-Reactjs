pipeline {
    agent any

    environment {
        AWS_CREDENTIALS_ID = 'NmWSL0{@'
        DOCKER_CREDENTIALS_ID = '^kyYjiNR82ihur%'
        EKS_CLUSTER_NAME = 'new-c'
        AWS_REGION = 'ap-south-1'  // Ensure this matches your EKS cluster region
        DOCKER_IMAGE_FRONTEND = 'ashreesee/frontend'
        DOCKER_IMAGE_BACKEND = 'ashreesee/backend'
        DOCKER_IMAGE_DB = 'mysql'  // Assuming MySQL is from Docker Hub
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Ashreesee/Mysql-CRUD-Operations-With-Nodejs-And-Reactjs.git'
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh """
                        docker build -t ${DOCKER_IMAGE_FRONTEND}:latest ./frontend
                        docker push ${DOCKER_IMAGE_FRONTEND}:latest

                        docker build -t ${DOCKER_IMAGE_BACKEND}:latest ./backend
                        docker push ${DOCKER_IMAGE_BACKEND}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to EKS using Helm') {
            steps {
                script {
                    withAWS(credentials: AWS_CREDENTIALS_ID, region: AWS_REGION) {
                        sh """
                        aws eks --region ${AWS_REGION} update-kubeconfig --name ${EKS_CLUSTER_NAME}

                        # Ensure Helm folder exists
                        if [ ! -d "helm" ]; then echo 'Helm directory not found!'; exit 1; fi

                        # Deploy MySQL using official Helm chart (optional)
                        helm upgrade --install mysql helm/mysql

                        # Deploy Backend
                        helm upgrade --install backend helm/backend

                        # Deploy Frontend
                        helm upgrade --install frontend helm/frontend
                        """
                    }
                }
            }
        }
    }
}
