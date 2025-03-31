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
                export KUBECONFIG=/home/ashree/Desktop/kubeconfig
                echo "✅ Using KUBECONFIG at: $KUBECONFIG"
                
                echo "🔍 Checking if Kubernetes is reachable..."
                kubectl cluster-info || (echo "❌ EKS Cluster is unreachable!" && exit 1)

                echo "🔍 Checking existing Helm deployments..."
                helm list || (echo "❌ Helm is not working!" && exit 1)

                echo "📦 Deploying MySQL..."
                helm upgrade --install mysql /home/ashree/Documents/Mysql-CRUD-Operations-With-Nodejs-And-Reactjs/helm/mysql --debug || (echo "❌ MySQL Deployment Failed" && exit 1)

                echo "🚀 Deploying Backend..."
                helm upgrade --install backend /home/ashree/Documents/Mysql-CRUD-Operations-With-Nodejs-And-Reactjs/helm/backend --debug || (echo "❌ Backend Deployment Failed" && exit 1)

                echo "🚀 Deploying Frontend..."
                helm upgrade --install frontend /home/ashree/Documents/Mysql-CRUD-Operations-With-Nodejs-And-Reactjs/helm/frontend --debug || (echo "❌ Frontend Deployment Failed" && exit 1)
                """
            }
            echo "✅ Deployment Completed!"
        }
    }
}
