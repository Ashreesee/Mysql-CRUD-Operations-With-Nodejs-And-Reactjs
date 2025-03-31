pipeline {
    agent any

    environment {
        AWS_CREDENTIALS_ID = 'aws-credentials'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        EKS_CLUSTER_NAME = 'new-c'
        AWS_REGION = 'ap-south-1'
        DOCKER_IMAGE_FRONTEND = 'ashreesee/frontend'
        DOCKER_IMAGE_BACKEND = 'ashreesee/backend'
        DOCKER_IMAGE_DB = 'mysql'
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
                    try {
                        sh 'docker --version'  // Check if Docker is installed
                        
                        // Manually log into Docker
                        withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                         sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                            }
                            // Build and push frontend
                            sh """
                            echo "Building frontend..."
                            docker build -t $DOCKER_IMAGE_FRONTEND:latest ./frontend || exit 1
                            docker push $DOCKER_IMAGE_FRONTEND:latest || exit 1
                            """

                            // Build and push backend
                            sh """
                            echo "Building backend..."
                            docker build -t $DOCKER_IMAGE_BACKEND:latest ./backend || exit 1
                            docker push $DOCKER_IMAGE_BACKEND:latest || exit 1
                            """
                        }
                    } catch (Exception e) {
                        echo "Error: ${e.message}"
                        error("Docker build and push failed!")
                    }
                }
            }
        }

        stage('Deploy to EKS using Helm') {
            steps {
                script {
                    withAWS(credentials: AWS_CREDENTIALS_ID, region: AWS_REGION) {
                        sh """
                        echo "Configuring kubectl for EKS..."
                        aws eks --region ${AWS_REGION} update-kubeconfig --name ${EKS_CLUSTER_NAME} || exit 1

                        echo "Deploying MySQL..."
                        helm upgrade --install mysql helm/mysql || exit 1

                        echo "Deploying Backend..."
                        helm upgrade --install backend helm/backend || exit 1

                        echo "Deploying Frontend..."
                        helm upgrade --install frontend helm/frontend || exit 1
                        """
                    }
                }
            }
        }
    }
}
