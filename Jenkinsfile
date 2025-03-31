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
        HELM_DIR = '/home/ashree/Documents/Mysql-CRUD-Operations-With-Nodejs-And-Reactjs/helm'  // ✅ Set Helm directory
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

                    echo "🚀 Building and Pushing Frontend..."
                    sh """
                    docker build --no-cache -t ${DOCKER_IMAGE_FRONTEND}:latest ./frontend
                    docker push ${DOCKER_IMAGE_FRONTEND}:latest
                    """

                    echo "🚀 Building and Pushing Backend..."
                    sh """
                    docker build --no-cache -t ${DOCKER_IMAGE_BACKEND}:latest ./backend
                    docker push ${DOCKER_IMAGE_BACKEND}:latest
                    """

                    echo "✅ Docker Build & Push Completed!"
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
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_PATH')]) {
                        sh """
                        export KUBECONFIG=/home/ashree/Desktop/kubeconfig  # ✅ Fixed Path

                        echo "🔧 Configuring kubectl for EKS..."
                        aws eks --region ${AWS_REGION} update-kubeconfig --name ${EKS_CLUSTER_NAME}
                        
                        echo "🔍 Verifying kubectl access..."
                        kubectl get nodes || (echo "❌ Unable to communicate with cluster" && exit 1)  # ✅ Exit if it fails

                        echo "🔄 Switching to Helm directory..."
                        cd ${HELM_DIR} || (echo "❌ Helm directory not found!" && exit 1)  # ✅ Exit if not found

                        echo "📦 Deploying MySQL..."
                        helm upgrade --install mysql mysql --debug || (echo "❌ MySQL Deployment Failed" && exit 1)

                        echo "🚀 Deploying Backend..."
                        helm upgrade --install backend backend --debug || (echo "❌ Backend Deployment Failed" && exit 1)

                        echo "🚀 Deploying Frontend..."
                        helm upgrade --install frontend frontend --debug || (echo "❌ Frontend Deployment Failed" && exit 1)
                        """
                    }
                    echo "✅ Deployment Completed!"
                }
            }
        }
    }
}

