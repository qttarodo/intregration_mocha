pipeline {
  agent any

  tools {nodejs "NodeJS"}

  stages {

    stage('Cloning Git') {
      steps {
        git 'https://github.com/qttarodo/intregration_mocha'
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test') {
      steps {
         sh 'npm test'
      }
    }
  }
}