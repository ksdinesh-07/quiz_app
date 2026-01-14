pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Validate') {
            steps {
                sh '''
                    echo "🔧 Quiz App CI Pipeline"
                    echo "Build: ${BUILD_NUMBER}"
                    echo ""
                    echo "📁 Files in repository:"
                    ls -la
                    echo ""
                    echo "✅ Validation complete"
                '''
            }
        }
        
        stage('Create Package') {
            steps {
                sh '''
                    echo "📦 Creating deployment package..."
                    
                    # Clean old packages
                    rm -rf deployment-package 2>/dev/null || true
                    rm -f *.zip 2>/dev/null || true
                    
                    # Create package directory
                    mkdir -p deployment-package
                    
                    # Copy web files
                    cp index.html deployment-package/
                    cp style.css deployment-package/
                    cp script.js deployment-package/
                    [ -f "questions.json" ] && cp questions.json deployment-package/
                    
                    # Copy Docker files if they exist
                    [ -f "Dockerfile" ] && cp Dockerfile deployment-package/
                    [ -f "Dockerfile.nginx" ] && cp Dockerfile.nginx deployment-package/
                    [ -f "nginx.conf" ] && cp nginx.conf deployment-package/
                    
                    # Create README
                    cat > deployment-package/README.md << 'README'
                    # Quiz App Deployment Package
                    
                    ## Files Included:
                    - index.html - Main application
                    - style.css - Styling
                    - script.js - Quiz logic
                    - questions.json - Quiz questions
                    - Docker configurations (if available)
                    
                    ## Quick Start:
                    1. Upload to web server
                    2. Open index.html
                    
                    ## Docker Deployment:
                    ```bash
                    docker build -t quiz-app -f Dockerfile.nginx .
                    docker run -p 8080:80 quiz-app
                    ```
                    README
                    
                    # Create ZIP
                    zip -r "quiz-app-${BUILD_NUMBER}.zip" deployment-package/
                    
                    echo "✅ Package created: quiz-app-${BUILD_NUMBER}.zip"
                    ls -lh *.zip
                '''
            }
        }
        
        stage('Archive') {
            steps {
                archiveArtifacts artifacts: "quiz-app-${BUILD_NUMBER}.zip", fingerprint: true
                archiveArtifacts artifacts: 'deployment-package/**', fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline successful!'
            sh '''
                echo ""
                echo "========================================"
                echo "✅ QUIZ APP CI/CD COMPLETE!"
                echo "========================================"
                echo "📦 Download: quiz-app-${BUILD_NUMBER}.zip"
                echo "📁 From Jenkins artifacts section"
                echo "🚀 Ready for deployment!"
                echo "========================================"
            '''
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            sh 'rm -rf deployment-package 2>/dev/null || true'
        }
    }
}
