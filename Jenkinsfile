pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code...'
                checkout scm
            }
        }
        
        stage('Validate Files') {
            steps {
                echo '📋 Validating files...'
                sh '''
                    echo "Build Number: ${BUILD_NUMBER}"
                    echo "Workspace: ${WORKSPACE}"
                    
                    echo "Checking files:"
                    ls -la
                    
                    [ -f "index.html" ] && echo "✅ index.html" || exit 1
                    [ -f "style.css" ] && echo "✅ style.css" || exit 1
                    [ -f "script.js" ] && echo "✅ script.js" || exit 1
                '''
            }
        }
        
        stage('Build Docker') {
            steps {
                echo '🐳 Building Docker...'
                sh '''
                    docker build -t quiz-app-node .
                    docker build -t quiz-app-nginx -f Dockerfile.nginx .
                    echo "✅ Docker images built"
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Testing...'
                sh '''
                    docker run -d --name test-node -p 3001:3000 quiz-app-node
                    sleep 5
                    curl -f http://localhost:3001 || exit 1
                    docker stop test-node
                    docker rm test-node
                '''
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleanup...'
            sh 'docker rm -f test-node 2>/dev/null || true'
        }
    }
}
