pipeline {
    agent any
    stages {
        stage('Build') { steps { sh 'docker build -t campify-mobile .' } }
        stage('Test') { steps { sh 'npm test' } }
        stage('Deploy') { steps { sh 'docker run -d -p 8081:8081 campify-mobile' } }
    }
}