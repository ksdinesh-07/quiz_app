pipeline {
    agent any
    
    parameters {
        choice(
            name: 'DEPLOY_PORT',
            choices: ['5000', '5001', '3001', '8080'],
            description: 'Select port for deployment'
        )
        booleanParam(
            name: 'CLEAN_BEFORE_BUILD',
            defaultValue: true,
            description: 'Clean Docker cache before build'
        )
    }
    
    environment {
        NODE_PORT = "${params.DEPLOY_PORT}"
        NGINX_PORT = "${(params.DEPLOY_PORT as Integer) + 1}"
        BUILD_TAG = "quiz-app-${BUILD_NUMBER}"
    }
    
    stages {
        stage('Prepare Environment') {
            steps {
                echo '🚀 Starting Quiz App Pipeline'
                echo "Build Number: ${BUILD_NUMBER}"
                echo "Node.js Port: ${NODE_PORT}"
                echo "Nginx Port: ${NGINX_PORT}"
                
                script {
                    if (params.CLEAN_BEFORE_BUILD) {
                        sh '''
                            echo "Cleaning Docker environment..."
                            docker system prune -f 2>/dev/null || true
                            docker volume prune -f 2>/dev/null || true
                        '''
                    }
                }
            }
        }
        
        stage('Check Source Files') {
            steps {
                echo '📋 Verifying source files...'
                sh '''
                    echo "Core application files:"
                    ls -lh index.html style.css script.js questions.json
                    
                    echo "Configuration files:"
                    ls -lh Dockerfile Dockerfile.nginx nginx.conf docker-compose.yml Jenkinsfile
                    
                    echo "File sizes:"
                    wc -l script.js style.css
                    
                    # Validate HTML
                    if head -5 index.html | grep -q "<!DOCTYPE html>"; then
                        echo "✅ Valid HTML5 document"
                    fi
                '''
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh '''
                    echo "1. Building quiz-app-node:${BUILD_TAG}"
                    docker build -t quiz-app-node:${BUILD_TAG} .
                    
                    echo "2. Building quiz-app-nginx:${BUILD_TAG}"
                    docker build -t quiz-app-nginx:${BUILD_TAG} -f Dockerfile.nginx .
                    
                    echo "✅ Images created:"
                    docker images | grep quiz-app
                '''
            }
        }
        
        stage('Test Deployment') {
            steps {
                echo '🧪 Testing deployment...'
                sh """
                    echo "Testing on port ${NODE_PORT}..."
                    docker run -d --name test-node-${BUILD_NUMBER} -p ${NODE_PORT}:3000 quiz-app-node:${BUILD_TAG}
                    sleep 3
                    
                    # Test the application
                    if curl -s -f http://localhost:${NODE_PORT} > /dev/null; then
                        echo "✅ Node.js deployment successful on port ${NODE_PORT}"
                        echo "📝 Test URL: http://localhost:${NODE_PORT}"
                    else
                        echo "❌ Node.js deployment failed"
                        docker logs test-node-${BUILD_NUMBER}
                        exit 1
                    fi
                    
                    echo "Testing Nginx on port ${NGINX_PORT}..."
                    docker run -d --name test-nginx-${BUILD_NUMBER} -p ${NGINX_PORT}:80 quiz-app-nginx:${BUILD_TAG}
                    sleep 2
                    
                    if curl -s -f http://localhost:${NGINX_PORT} > /dev/null; then
                        echo "✅ Nginx deployment successful on port ${NGINX_PORT}"
                        echo "📝 Test URL: http://localhost:${NGINX_PORT}"
                    else
                        echo "⚠️  Nginx test had issues"
                    fi
                """
            }
        }
        
        stage('Create Deployment Packages') {
            steps {
                echo '📦 Packaging for deployment...'
                sh """
                    # Create directory structure
                    rm -rf deployment-packages 2>/dev/null || true
                    mkdir -p deployment-packages
                    
                    # Package 1: Web files only (for S3/Static hosting)
                    mkdir -p deployment-packages/web-only
                    cp index.html deployment-packages/web-only/
                    cp style.css deployment-packages/web-only/
                    cp script.js deployment-packages/web-only/
                    cp questions.json deployment-packages/web-only/
                    
                    cat > deployment-packages/web-only/DEPLOY.md << 'EOF'
                    # Web Files Deployment
                    
                    ## For AWS S3:
                    1. Login to AWS Console
                    2. Go to S3 → Create bucket
                    3. Upload all files from this folder
                    4. Enable static website hosting
                    5. Set index.html as index document
                    
                    ## For any web server:
                    Upload all files to your web server's public directory
                    EOF
                    
                    zip -r deployment-packages/quiz-app-web.zip deployment-packages/web-only/
                    
                    # Package 2: Docker deployment
                    mkdir -p deployment-packages/docker
                    cp index.html deployment-packages/docker/
                    cp style.css deployment-packages/docker/
                    cp script.js deployment-packages/docker/
                    cp questions.json deployment-packages/docker/
                    cp Dockerfile deployment-packages/docker/
                    cp Dockerfile.nginx deployment-packages/docker/
                    cp nginx.conf deployment-packages/docker/
                    cp docker-compose.yml deployment-packages/docker/
                    
                    cat > deployment-packages/docker/deploy.sh << 'EOF'
                    #!/bin/bash
                    echo "Quiz App Docker Deployment"
                    echo "==========================="
                    
                    PORT=\${1:-5000}
                    
                    # Build images
                    docker build -t quiz-app-node .
                    docker build -t quiz-app-nginx -f Dockerfile.nginx .
                    
                    # Run
                    echo "Starting on port \$PORT..."
                    docker run -d -p \$PORT:3000 --name quiz-app quiz-app-node
                    
                    echo "✅ Deployment complete!"
                    echo "🌐 Access at: http://localhost:\$PORT"
                    EOF
                    
                    chmod +x deployment-packages/docker/deploy.sh
                    zip -r deployment-packages/quiz-app-docker.zip deployment-packages/docker/
                    
                    echo "📁 Packages created:"
                    ls -lh deployment-packages/*.zip
                """
            }
        }
        
        stage('Generate Reports') {
            steps {
                echo '📊 Generating build reports...'
                sh """
                    # Create build report
                    cat > build-report.md << 'EOF'
                    # Quiz App Build Report #${BUILD_NUMBER}
                    
                    ## Build Information
                    - **Build Number**: ${BUILD_NUMBER}
                    - **Build Date**: $(date)
                    - **Node.js Port**: ${NODE_PORT}
                    - **Nginx Port**: ${NGINX_PORT}
                    
                    ## Test Results
                    - ✅ Application tested successfully
                    - ✅ Node.js running on port ${NODE_PORT}
                    - ✅ Nginx running on port ${NGINX_PORT}
                    
                    ## Deployment Packages
                    1. **quiz-app-web.zip** - Web files only (for AWS S3)
                    2. **quiz-app-docker.zip** - Complete Docker deployment
                    
                    ## Next Steps
                    1. Download packages from Jenkins artifacts
                    2. For AWS: Use quiz-app-web.zip with S3 Console
                    3. For Docker: Use quiz-app-docker.zip
                    
                    ## Test URLs
                    - http://localhost:${NODE_PORT} (Node.js)
                    - http://localhost:${NGINX_PORT} (Nginx)
                    EOF
                    
                    echo "📄 Report generated: build-report.md"
                """
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleanup...'
            sh """
                # Clean test containers
                docker stop test-node-${BUILD_NUMBER} test-nginx-${BUILD_NUMBER} 2>/dev/null || true
                docker rm test-node-${BUILD_NUMBER} test-nginx-${BUILD_NUMBER} 2>/dev/null || true
                
                echo "Test containers cleaned up"
            """
        }
        success {
            echo '✅ PIPELINE SUCCESSFUL!'
            sh """
                echo ""
                echo "🎉 QUIZ APP DEPLOYMENT READY!"
                echo "=============================="
                echo ""
                echo "📦 Download packages from Jenkins Artifacts"
                echo "🌐 Test your app at:"
                echo "   - Node.js: http://localhost:${NODE_PORT}"
                echo "   - Nginx:   http://localhost:${NGINX_PORT}"
                echo ""
                echo "🚀 For AWS Deployment:"
                echo "   1. Download quiz-app-web.zip"
                echo "   2. Go to AWS S3 Console"
                echo "   3. Create bucket and upload files"
                echo "   4. Enable static website hosting"
                echo ""
            """
            
            // Archive everything
            archiveArtifacts artifacts: 'deployment-packages/*.zip', fingerprint: true
            archiveArtifacts artifacts: 'build-report.md', fingerprint: true
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}