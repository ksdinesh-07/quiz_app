pipeline {
    agent {
        docker { 
            image 'node:18-alpine'
            args '-u root'
        }
    }
    
    stages {
        stage('Checkout') {
            steps { 
                checkout scm 
            }
        }
        
        stage('Setup') {
            steps {
                sh '''
                    echo "Installing required packages..."
                    apk add --no-cache docker-cli curl zip
                    echo "Build: ${BUILD_NUMBER}"
                    ls -la
                '''
            }
        }
        
        stage('Build Package') {
            steps {
                sh '''
                    echo "Creating deployment package..."
                    mkdir -p package
                    cp index.html style.css script.js questions.json package/
                    zip -r quiz-app-${BUILD_NUMBER}.zip package/
                '''
                archiveArtifacts artifacts: '*.zip', fingerprint: true
            }
        }
    }
}
