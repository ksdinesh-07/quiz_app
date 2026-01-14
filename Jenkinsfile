pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Package') {
            steps {
                sh '''
                    echo "Build ${BUILD_NUMBER}: Creating ZIP with Docker..."
                    
                    # Clean up
                    rm -f *.zip 2>/dev/null || true
                    
                    # Use Docker to create zip (Ubuntu has zip)
                    docker run --rm \
                      -v "$PWD:/app" \
                      ubuntu:latest \
                      bash -c "
                        cd /app
                        mkdir -p package
                        cp index.html style.css script.js package/
                        [ -f questions.json ] && cp questions.json package/
                        zip -r output.zip package/
                      "
                    
                    # Rename
                    mv output.zip "quiz-app-${BUILD_NUMBER}.zip"
                    
                    echo "✅ Created: quiz-app-${BUILD_NUMBER}.zip"
                '''
                archiveArtifacts artifacts: "quiz-app-${BUILD_NUMBER}.zip"
            }
        }
    }
}
