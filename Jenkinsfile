pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Package') {
            steps {
                sh '''
                    echo "Building package ${BUILD_NUMBER}..."
                    mkdir -p pkg
                    cp index.html pkg/
                    cp style.css pkg/
                    cp script.js pkg/
                    [ -f "questions.json" ] && cp questions.json pkg/
                    tar -czf quiz-app.tar.gz pkg/
                    echo "Package: quiz-app.tar.gz"
                    ls -lh *.tar.gz
                '''
                archiveArtifacts artifacts: 'quiz-app.tar.gz', fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo "✅ Build ${BUILD_NUMBER} complete! Download artifacts."
        }
    }
}
