// groovy
pipeline {
    agent any

    environment {
        ANDROID_HOME = '/Users/hakantetik/Library/Android/sdk'
        PATH = "${env.ANDROID_HOME}/platform-tools:${env.ANDROID_HOME}/tools:${env.PATH}"
        ALLURE_HOME = tool 'Allure'
    }

    tools {
        maven 'maven'
        jdk 'JDK17'
        nodejs 'Node'
        allure 'Allure'
    }

    parameters {
        choice(name: 'PLATFORM', choices: ['Android','iOS','Web'], description: 'Sélectionnez la plateforme de test')
        string(name: 'APPIUM_VERSION', defaultValue: '2.5.4', description: 'Version d\'Appium à installer (ex: 2.5.4)')
        string(name: 'XCODE_PATH', defaultValue: '/Applications/Xcode.app', description: 'Chemin vers Xcode (iOS)')
        booleanParam(name: 'USE_REAL_DEVICE', defaultValue: false, description: 'Utiliser un appareil réel (iOS/Android)')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
    }

    stages {
        stage('Info environnements') {
            steps {
                script {
                    sh '''
                        echo "=== Versions outils ==="
                        java -version || true
                        mvn -v || true
                        node -v || true
                        npm -v || true
                        xcodebuild -version || true
                        xcrun --version || true
                    '''
                }
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    try {
                        // Install / update Appium and platform-specific tools
                        sh """
                            echo "📦 Installation Appium ${params.APPIUM_VERSION}"
                            npm uninstall -g appium || true
                            npm install -g appium@${params.APPIUM_VERSION} || true

                            echo "🔎 Drivers Appium installés:"
                            appium driver list --installed || true
                        """

                        if (params.PLATFORM == 'iOS') {
                            sh """
                                echo "🍎 Setup iOS prerequisites"
                                echo "DEVELOPER_DIR=${params.XCODE_PATH}"
                                export DEVELOPER_DIR=${params.XCODE_PATH}

                                # CocoaPods
                                if ! command -v pod >/dev/null 2>&1; then
                                    echo "installing CocoaPods..."
                                    sudo gem install cocoapods || sudo gem install cocoapods --no-document || true
                                fi

                                # ios-deploy for physical device installs
                                if ! command -v ios-deploy >/dev/null 2>&1; then
                                    brew install ios-deploy || true
                                fi

                                # libimobiledevice for device detection (optional)
                                if ! command -v idevice_id >/dev/null 2>&1; then
                                    brew install --HEAD libimobiledevice || true
                                fi

                                pod --version || true
                                ios-deploy --version || true
                            """
                        } else if (params.PLATFORM == 'Android') {
                            sh """
                                echo "🤖 Setup Android prerequisites"
                                adb version || true
                                sdkmanager --list || true
                            """
                        } else {
                            sh 'echo "🌐 Web platform selected - no native prerequisites"'
                        }
                    } catch (Exception e) {
                        echo "Setup error: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Start Appium') {
            when { expression { params.PLATFORM != 'Web' } }
            steps {
                script {
                    try {
                        sh '''
                            echo "🚀 Starting Appium on port 4723..."
                            pkill -f appium || true
                            sleep 2
                            appium --log appium.log --relaxed-security --port 4723 > appium.out 2>&1 &
                            sleep 8
                            if curl -s http://localhost:4723/status | grep -q "ready"; then
                                echo "✅ Appium ready"
                            else
                                echo "❌ Appium failed to start - dumping logs"
                                tail -n 200 appium.out || true
                                cat appium.log || true
                                exit 1
                            fi
                        '''
                    } catch (Exception e) {
                        echo "Appium start error: ${e.message}"
                        sh 'tail -n 200 appium.out || true'
                        throw e
                    }
                }
            }
        }

        stage('Verify Devices') {
            when { expression { params.PLATFORM != 'Web' } }
            steps {
                script {
                    if (params.PLATFORM == 'Android') {
                        sh '''
                            echo "🔎 Android devices:"
                            adb devices || true
                            if [ "${USE_REAL_DEVICE}" = "true" ]; then
                                if ! adb devices | grep -q "device$"; then
                                    echo "❌ No Android device connected"
                                    exit 1
                                fi
                            else
                                echo "Using emulator/simulator - ensure AVD is running"
                            fi
                        '''
                    } else if (params.PLATFORM == 'iOS') {
                        sh """
                            echo "🔎 iOS devices/simulators:"
                            xcrun simctl list devices || true
                            if [ "${USE_REAL_DEVICE}" = "true" ]; then
                                echo "Listing physical devices (idevice_id -l)..."
                                idevice_id -l || true
                                if ! idevice_id -l | grep -q '.' ; then
                                    echo "❌ No iOS physical device detected"
                                    exit 1
                                fi
                            fi
                        """
                    }
                }
            }
        }

        stage('Start WebDriverAgent (iOS)') {
            when { expression { params.PLATFORM == 'iOS' } }
            steps {
                script {
                    sh """
                        echo "🔧 Starting WebDriverAgent using Xcode at ${params.XCODE_PATH}"
                        export DEVELOPER_DIR=${params.XCODE_PATH}
                        cd ${WORKSPACE} || exit 1

                        # Install Pods for the project if present
                        if [ -f ios/Podfile ]; then
                            echo "Installing CocoaPods dependencies..."
                            cd ios || true
                            pod install || true
                            cd ..
                        fi

                        # Build and run WebDriverAgent (try both simulator and device)
                        if [ -d ios/Pods ]; then
                            echo "Building WebDriverAgent from installed pods (if available)..."
                        fi

                        # Try launching WDA for a physical device if requested
                        if [ "${USE_REAL_DEVICE}" = "true" ]; then
                            echo "Launching WebDriverAgentRunner on connected device..."
                            cd /usr/local/lib/node_modules/appium-webdriveragent || true
                            export DEVELOPER_DIR=${params.XCODE_PATH}
                            xcodebuild -project WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner -destination 'generic/platform=iOS' test -allowProvisioningUpdates | tee wda_build.log &
                            sleep 30
                            tail -n 200 wda_build.log || true
                        else
                            echo "Skipping physical WDA run (USE_REAL_DEVICE=false). Appium will manage simulator sessions."
                        fi
                    """
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    try {
                        def p = params.PLATFORM.toLowerCase()
                        sh """
                            rm -rf target/cucumber-reports target/allure-results || true
                            mkdir -p target/cucumber-reports target/allure-results || true
                        """

                        if (p == 'ios') {
                            sh """
                                echo "🍎 Running iOS tests"
                                export DEVELOPER_DIR=${params.XCODE_PATH}
                                mvn clean test -DplatformName=ios -Dappium.version=${params.APPIUM_VERSION}
                            """
                        } else if (p == 'android') {
                            sh """
                                echo "🤖 Running Android tests"
                                mvn clean test -DplatformName=android -Dappium.version=${params.APPIUM_VERSION}
                            """
                        } else {
                            sh """
                                echo "🌐 Running Web tests"
                                mvn clean test -DplatformName=web
                            """
                        }
                    } catch (Exception e) {
                        echo "Test execution failed: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                        error("Test execution error")
                    }
                }
            }
            options {
                timeout(time: 30, unit: 'MINUTES')
                retry(2)
            }
        }
    }

    post {
        always {
            script {
                sh 'pkill -f appium || true'
                sh '''
                    echo "📂 Listing report folders"
                    ls -la target || true
                    ls -la target/cucumber-reports || true
                    ls -la target/allure-results || true
                '''

                # Move cucumber.json if present
                sh '''
                    rm -rf target/cucumber-reports || true
                    mkdir -p target/cucumber-reports || true
                    if [ -f target/cucumber.json ]; then
                        cp target/cucumber.json target/cucumber-reports/ || true
                    fi
                '''

                cucumber(
                    fileIncludePattern: 'cucumber.json',
                    jsonReportDirectory: 'target/cucumber-reports',
                    reportTitle: 'Mobile Test Results',
                    buildStatus: currentBuild.result == 'UNSTABLE' ? 'UNSTABLE' : 'SUCCESS'
                )

                archiveArtifacts artifacts: 'target/cucumber-reports/**/*', allowEmptyArchive: true

                // Allure
                allure([
                    includeProperties: true,
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'target/allure-results']],
                    report: 'target/allure-report'
                ])

                sh """
                    export PATH="${env.ALLURE_HOME}/bin:${env.PATH}"
                    if [ -d target/allure-results ]; then
                        allure generate target/allure-results --clean -o target/allure-report || true
                    fi
                """

                archiveArtifacts artifacts: 'target/allure-results/**/*.*,target/allure-report/**/*.*', fingerprint: true

                echo "📌 Pipeline finished. Platform: ${params.PLATFORM}. Build result: ${currentBuild.currentResult}"
            }
        }
        cleanup {
            cleanWs()
        }
    }
}
