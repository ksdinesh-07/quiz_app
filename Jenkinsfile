pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Create Package') {
            steps {
                sh '''
                    echo "Creating package for build ${BUILD_NUMBER}..."
                    mkdir -p package
                    cp index.html style.css script.js questions.json package/ 2>/dev/null || true
                    zip -r "quiz-app-${BUILD_NUMBER}.zip" package/
                    echo "Package created: quiz-app-${BUILD_NUMBER}.zip"
                    ls -lh *.zip
                '''
            }
        }
        
        stage('Archive') {
            steps {
                archiveArtifacts artifacts: "quiz-app-${BUILD_NUMBER}.zip", fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo "✅ Build ${BUILD_NUMBER} successful!"
        }
    }
}
