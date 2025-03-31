pipeline {
    agent any

    environment {
        AWS_CREDENTIALS_ID = 'aws-credentials'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        EKS_CLUSTER_NAME = 'jenkins'
        AWS_REGION = 'ap-south-1'
        DOCKER_IMAGE_FRONTEND = 'ashreesee/frontend'
        DOCKER_IMAGE_BACKEND = 'ashreesee/backend'
        DOCKER_IMAGE_DB = 'mysql'
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    echo "🔄 Cloning Repository..."
                    git branch: 'main', url: 'https://github.com/Ashreesee/Mysql-CRUD-Operations-With-Nodejs-And-Reactjs.git'
                    echo "✅ Repository Cloned!"
                }
            }
        }

        stage('Build and Push Docker Images') {
    steps {
        script {
            echo "🔍 Checking Docker Version..."
            sh 'docker --version'

            echo "🔑 Logging into Docker Hub..."
            withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
            }

            try {
                echo "🚀 Checking if frontend directory exists..."
                sh "ls -lah frontend"

                echo "🚀 Building and Pushing Frontend..."
                sh """
                docker build --no-cache -t ${DOCKER_IMAGE_FRONTEND}:latest ./frontend
                docker push ${DOCKER_IMAGE_FRONTEND}:latest
                """

                echo "🚀 Checking if backend directory exists..."
                sh "ls -lah backend"

                echo "🚀 Building and Pushing Backend..."
                sh """
                docker build --no-cache -t ${DOCKER_IMAGE_BACKEND}:latest ./backend
                docker push ${DOCKER_IMAGE_BACKEND}:latest
                """

                echo "✅ Docker Build & Push Completed!"
            } catch (Exception e) {
                echo "❌ Error: ${e.message}"
                error("🚨 Docker build and push failed!")
            }
        }
    }
}
        stage('Verify AWS Credentials') {
    steps {
        script {
            withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: AWS_CREDENTIALS_ID]]) {
                sh '''
                echo "🔄 Checking AWS Identity..."
                aws sts get-caller-identity || echo "❌ AWS Credentials are incorrect"
                '''
            }
        }
    }
}

        stage('Deploy to EKS using Helm') {
            steps {
                script {
                    echo "🔄 Starting Deployment to EKS..."
                    withAWS(credentials: AWS_CREDENTIALS_ID, region: AWS_REGION) {
                        sh """
                        echo "🔧 Configuring kubectl for EKS..."
                        aws eks --region ${AWS_REGION} update-kubeconfig --name ${EKS_CLUSTER_NAME}

                        echo "📦 Deploying MySQL..."
                        helm upgrade --install mysql helm/mysql

                        echo "🚀 Deploying Backend..."
                        helm upgrade --install backend helm/backend

                        echo "🚀 Deploying Frontend..."
                        helm upgrade --install frontend helm/frontend
                        """
                    }
                    echo "✅ Deployment Completed!"
                }
            }
        }
    }
}

