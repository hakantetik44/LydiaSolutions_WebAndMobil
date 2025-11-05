pipeline {
  agent any

  parameters {
    choice(name: 'PLATFORM', choices: ['android','ios','web'], description: 'Platform to test')
  }

  options {
    timestamps()
    timeout(time: 90, unit: 'MINUTES')
  }

  stages {
    stage('Prepare') {
      steps {
        echo "Preparing environment (minimal Jenkinsfile). Selected platform: ${params.PLATFORM}"
        sh 'java -version || true'
        sh 'mvn -v || true'
      }
    }

    stage('Confirm') {
      steps {
        script {
          // Ask for manual confirmation before running tests (useful when pipeline is triggered automatically)
          def userInput = input id: 'ProceedOrAbort', message: "Confirmer l'exécution des tests pour la plateforme '${params.PLATFORM}' ?", parameters: [choice(name: 'ACTION', choices: ['Proceed','Abort'], description: 'Proceed to run tests or Abort')]
          if (userInput == 'Abort') {
            error('Build aborted by user at confirmation step')
          }
        }
      }
    }

    stage('Prechecks') {
      steps {
        script {
          def p = params.PLATFORM.toLowerCase()

          echo "Vérification des prérequis pour la plateforme: ${p}"

          // Common checks
          sh '''
            echo "-- PATH and basic tools --"
            echo "which adb:"; which adb || true
            echo "which xcrun:"; which xcrun || true
            echo "which appium:"; which appium || true
            echo "which allure:"; which allure || true
          '''

          if (p == 'android') {
            // Check adb presence
            def adbExists = sh(returnStatus: true, script: 'which adb >/dev/null 2>&1') == 0
            if (!adbExists) {
              error("Prerequisite missing: 'adb' not found on PATH. Install Android SDK platform-tools on the agent.")
            }

            // Check Appium and UiAutomator2 driver
            def appiumExists = sh(returnStatus: true, script: 'which appium >/dev/null 2>&1') == 0
            if (!appiumExists) {
              error("Prerequisite missing: 'appium' not found. Install Appium on the agent or configure it on Jenkins.")
            }

            // Check Appium driver list for uiautomator2
            def driverCheckCmd = 'appium driver list --installed || true'
            def installedDrivers = sh(returnStdout: true, script: driverCheckCmd).trim()
            if (!installedDrivers.toLowerCase().contains('uiautomator2')) {
              error("Appium UiAutomator2 driver not installed. Run 'appium driver install uiautomator2' on the agent.")
            }

          } else if (p == 'ios') {
            // Check Xcode tools
            def xcrunExists = sh(returnStatus: true, script: 'which xcrun >/dev/null 2>&1') == 0
            if (!xcrunExists) {
              error("Prerequisite missing: 'xcrun' not found. Install Xcode command line tools on the agent.")
            }

            // Check Appium and XCUITest driver
            def appiumExists = sh(returnStatus: true, script: 'which appium >/dev/null 2>&1') == 0
            if (!appiumExists) {
              error("Prerequisite missing: 'appium' not found. Install Appium on the agent or configure it on Jenkins.")
            }

            def driverCheckCmd = 'appium driver list --installed || true'
            def installedDrivers = sh(returnStdout: true, script: driverCheckCmd).trim()
            if (!installedDrivers.toLowerCase().contains('xcuitest')) {
              error("Appium XCUITest driver not installed. Run 'appium driver install xcuitest' on the agent.")
            }
          } else {
            echo "Web run selected - no native prechecks"
          }
        }
      }
    }

    stage('Run Tests') {
      steps {
        script {
          def p = params.PLATFORM.toLowerCase()
          if (p == 'ios') {
            echo 'Running iOS tests'
            sh 'mvn -B -DplatformName=ios clean test'
          } else if (p == 'android') {
            echo 'Running Android tests'
            sh 'mvn -B -DplatformName=android clean test'
          } else {
            echo 'Running Web tests'
            sh 'mvn -B -DplatformName=web clean test'
          }
        }
      }
    }
  }

  post {
    always {
      script {
        sh '''
          echo "Listing target folder"
          ls -la target || true
        '''

        archiveArtifacts artifacts: 'target/**/*', allowEmptyArchive: true
        junit 'target/surefire-reports/**/*.xml'

        // Try to generate Allure report if CLI is present
        sh '''
          if [ -d target/allure-results ]; then
            if command -v allure >/dev/null 2>&1; then
              allure generate target/allure-results --clean -o target/allure-report || true
            else
              echo "Allure CLI not found, skipping generate - to install: https://docs.qameta.io/allure/"
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
