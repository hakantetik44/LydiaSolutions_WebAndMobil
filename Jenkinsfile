pipeline {
    agent any

    environment {
        ANDROID_HOME = '/Users/hakantetik/Library/Android/sdk'
        PATH = "/usr/local/bin:${env.ANDROID_HOME}/platform-tools:${env.ANDROID_HOME}/tools:${env.PATH}"
        ALLURE_HOME = tool 'Allure'
    }

    tools {
        maven 'maven'
        jdk 'JDK17'
        nodejs 'Node'
        allure 'Allure'
    }

    parameters {
        choice(
            name: 'PLATFORM',
            choices: ['Android', 'iOS', 'Web'],
            description: 'Sélectionnez la plateforme de test'
        )
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timestamps()
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    sh '''
                        echo "🔧 Informations sur l'environnement:"
                        echo "ANDROID_HOME: $ANDROID_HOME"
                    '''
                }
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    try {
                        if (params.PLATFORM != 'Web') {
                            sh '''
                                echo "📱 Installation d'Appium"
                                npm uninstall -g appium || true
                                npm install -g appium@2.5.4
                                echo "✅ Installation Terminée"
                                appium driver list --installed || true
                            '''
                        }
                    } catch (Exception e) {
                        echo "❌ Erreur d'Installation: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Start Appium') {
            when {
                expression { params.PLATFORM != 'Web' }
            }
            steps {
                script {
                    try {
                        sh '''
                            echo "🚀 Démarrage d'Appium..."
                            pkill -f appium || true
                            sleep 2
                            appium --log appium.log --relaxed-security > /dev/null 2>&1 &
                            sleep 10
                            if curl -s http://localhost:4723/status | grep -q "ready"; then
                                echo "✅ Serveur Appium démarré avec succès"
                            else
                                echo "❌ Échec du démarrage du serveur Appium"
                                exit 1
                            fi
                        '''
                    } catch (Exception e) {
                        echo "❌ Erreur de Démarrage Appium: ${e.message}"
                        throw e
                    }
                }
            }
        }

        stage('Start WebDriverAgent') {
            when {
                expression { params.PLATFORM.toLowerCase() == 'ios' }
            }
            steps {
                script {
                    echo "🔧 Démarrage de WebDriverAgent..."
                    sh '''
                        cd /usr/local/lib/node_modules/appium-webdriveragent
                        xcodebuild -project WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner -destination id=00008101-000A3DA60CD1003A test &
                        echo "⏳ Attente de 40 secondes pour WebDriverAgent..."
                        sleep 40
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    try {
                        sh 'obs --startrecording &'
                        // Testleri çalıştır
                        sh 'mvn clean test -DplatformName=android -Dcucumber.filter.tags="@smoke" -s settings.xml'
                        sh 'obs --stoprecording'
                    } catch (Exception e) {
                        echo "⚠️ Test Error:" 
                        echo "Error Message: ${e.message}"
                        echo "Platform: ${params.PLATFORM}"
                        echo "Build: ${BUILD_NUMBER}"
                        currentBuild.result = 'FAILURE'
                        error "Testler başarısız oldu, pipeline durduruluyor."
                    }
                }
            }
            options {
                timeout(time: 30, unit: 'MINUTES')
            }
        }

        stage('Build') {
            steps {
                echo "Build stage is not implemented yet"
            }
        }

        stage('Test') {
            steps {
                // Video kaydını başlat
                sh 'ffmpeg -f x11grab -s 1920x1080 -i :0.0 -r 30 -vcodec libx264 output.mp4 &'
                
                // Testleri çalıştır
                sh 'mvn clean test -DplatformName=android -Dcucumber.filter.tags="@smoke" -s settings.xml'
                
                // Video kaydını durdur
                sh 'pkill ffmpeg'
            }
        }
    }

    post {
        always {
            script {
                sh 'pkill -f appium || true'
                
                sh '''
                    echo "🔍 Verifying test execution and reports..."
                    ls -la target/ || true
                    ls -la target/cucumber-reports/ || true
                    echo "Test execution complete"
                '''
                
                // Clean and prepare cucumber-reports directory
                sh '''
                    rm -rf target/cucumber-reports
                    mkdir -p target/cucumber-reports
                    if [ -f target/cucumber.json ]; then
                        cp target/cucumber.json target/cucumber-reports/
                    fi
                '''
                
                cucumber(
                    fileIncludePattern: 'cucumber.json',
                    jsonReportDirectory: 'target/cucumber-reports',
                    reportTitle: 'Wigl',
                    buildStatus: currentBuild.result == 'UNSTABLE' ? 'UNSTABLE' : 'SUCCESS',
                    classificationsFiles: ['config/classifications.properties'],
                    mergeFeaturesById: true,
                    mergeFeaturesWithRetest: true,
                    failedFeaturesNumber: 999,
                    failedScenariosNumber: 999,
                    failedStepsNumber: 999,
                    pendingStepsNumber: 999,
                    skippedStepsNumber: 999,
                    undefinedStepsNumber: 999
                )
                
                // Archive the Cucumber reports
                archiveArtifacts artifacts: 'target/cucumber-reports/**/*', allowEmptyArchive: true
                
                // Nettoyer le répertoire des rapports Allure
                sh 'rm -rf target/allure-report || true'
                
                // Générer le rapport Allure
                allure([
                    includeProperties: true,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'target/allure-results']],
                    report: 'target/allure-report'
                ])

                // Régénérer le rapport avec la ligne de commande Allure
                sh """
                    export PATH="${env.ALLURE_HOME}/bin:${env.PATH}"
                    allure generate target/allure-results --clean -o target/allure-report
                """

                // Archiver les rapports Allure
                archiveArtifacts artifacts: 'target/allure-results/**/*.*,target/allure-report/**/*.*', fingerprint: true

                echo "📊 Résultats des Tests:"
                echo "📱 Plateforme: ${params.PLATFORM}"
                echo "🌿 Branche: ${env.BRANCH_NAME ?: 'unknown'}"
                echo "🏗️ État: ${currentBuild.currentResult}"
                echo "ℹ️ Note: Les tests marqués @known_issue sont signalés comme des avertissements"
            }
        }
        cleanup {
            cleanWs()
        }
    }
}