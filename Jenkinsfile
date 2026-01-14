pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Package') {
            steps {
                sh '''
                    echo "Build ${BUILD_NUMBER}: Creating package..."
                    rm -rf package 2>/dev/null || true
                    rm -f *.tar.gz 2>/dev/null || true
                    
                    mkdir -p package
                    cp index.html style.css script.js package/
                    [ -f "questions.json" ] && cp questions.json package/
                    
                    # Create tar.gz (works without zip)
                    tar -czf "quiz-app-${BUILD_NUMBER}.tar.gz" package/
                    
                    echo "✅ Package: quiz-app-${BUILD_NUMBER}.tar.gz"
                    ls -lh *.tar.gz
                '''
                archiveArtifacts artifacts: "quiz-app-${BUILD_NUMBER}.tar.gz", fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline successful! Download .tar.gz file'
        }
    }
}
