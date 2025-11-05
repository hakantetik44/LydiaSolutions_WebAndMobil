pipeline {
    agent any

    tools {
        maven 'maven'
        jdk 'JDK17'
    }

    parameters {
        choice(name: 'PLATFORM', choices: ['android','ios','web'], description: 'Platform to test')
    }

    options {
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
    }

    stages {
        stage('Prepare') {
            steps {
                echo "Preparing environment (minimal Jenkinsfile)"
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def p = params.PLATFORM.toLowerCase()
                    if (p == 'ios') {
                        sh 'mvn -B -DplatformName=ios clean test'
                    } else if (p == 'android') {
                        sh 'mvn -B -DplatformName=android clean test'
                    } else {
                        sh 'mvn -B -DplatformName=web clean test'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Archive build artifacts and try to generate Allure report if results exist
                sh '''
                    echo "Listing target folder"
                    ls -la target || true
                '''

                archiveArtifacts artifacts: 'target/**/*', allowEmptyArchive: true
                junit 'target/surefire-reports/**/*.xml'

                sh '''
                    if [ -d target/allure-results ]; then
                        if command -v allure >/dev/null 2>&1; then
                            allure generate target/allure-results --clean -o target/allure-report || true
                        else
                            echo "Allure CLI not found, skipping generate"
                        fi
                    else
                        echo "No allure-results found"
                    fi
                '''

                echo "Pipeline finished. Platform: ${params.PLATFORM}."
            }
        }
        cleanup {
            cleanWs()
        }
    }
}
