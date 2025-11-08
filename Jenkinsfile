pipeline {
  agent any

  parameters {
    choice(name: 'PLATFORM', choices: ['android','ios','web'], description: 'Platform to test')
  }

  options {
    timestamps()
    timeout(time: 90, unit: 'MINUTES')
  }

  environment {
    CI = 'true' // make test code skip opening Allure UI
  }

  stages {
    stage('Prepare') {
      steps {
        echo "Preparing environment for platform: ${params.PLATFORM}"
        sh 'node -v || echo "Node.js not found"'
        sh 'npm -v || echo "npm not found"'

        script {
          // Add npm global bin to PATH (for appium)
          def npmGlobalBin = sh(returnStdout: true, script: 'npm config get prefix 2>/dev/null || echo "/usr/local"').trim()
          env.PATH = "${npmGlobalBin}/bin:${env.PATH}"
          echo "Updated PATH: ${env.PATH}"
        }
      }
    }

    stage('Install Dependencies') {
      steps {
        sh '''
          if [ -f package-lock.json ]; then
            npm ci
          else
            npm install
          fi
        '''
      }
    }

    stage('Setup Appium') {
      when { expression { params.PLATFORM != 'web' } }
      steps {
        script {
          echo "Checking Appium installation..."
          def appiumExists = sh(returnStatus: true, script: 'which appium >/dev/null 2>&1') == 0
          if (!appiumExists) {
            echo "Installing Appium 3.1.0 globally..."
            sh 'npm install -g appium@3.1.0 || true'
            sh 'sleep 2'
          } else {
            echo "Appium already installed"
            sh 'appium --version'
          }

          def p = params.PLATFORM.toLowerCase()
          if (p == 'ios') {
            echo "Installing XCUITest driver..."
            sh 'appium driver install xcuitest || true'
          } else if (p == 'android') {
            echo "Installing UiAutomator2 driver..."
            sh 'appium driver install uiautomator2 || true'
          }

          sh 'appium driver list --installed'
        }
      }
    }

    stage('Start Appium Server') {
      when { expression { params.PLATFORM != 'web' } }
      steps {
        script {
          echo "Starting Appium server on port 4723..."
          sh 'pkill -f appium || true'
          sh 'sleep 2'
          sh '''
            nohup appium --log appium.log --relaxed-security --port 4723 > appium.out 2>&1 &
            echo $! > appium.pid
            sleep 8
          '''
          def appiumStatus = sh(returnStatus: true, script: 'curl -s http://localhost:4723/status | grep -q "ready"')
          if (appiumStatus == 0) {
            echo "Appium server started successfully"
          } else {
            echo "Appium may not be ready, checking logs..."
            sh 'tail -50 appium.log || cat appium.out || echo "No logs found"'
          }
        }
      }
    }

    stage('Prechecks') {
      steps {
        script {
          def p = params.PLATFORM.toLowerCase()
          echo "Pre-checks for platform: ${p}"
          sh '''
            echo "-- Checking basic tools --"
            if which adb >/dev/null 2>&1; then
              echo "adb found: $(which adb)"
            else
              echo "adb not found (needed for Android)"
            fi

            if which xcrun >/dev/null 2>&1; then
              echo "xcrun found: $(which xcrun)"
            else
              echo "xcrun not found (needed for iOS)"
            fi

            if which appium >/dev/null 2>&1; then
              echo "appium found: $(which appium)"
              appium --version
            else
              echo "appium not found"
              exit 1
            fi

            if which allure >/dev/null 2>&1; then
              echo "allure found: $(which allure)"
            else
              echo "allure not found (plugin will be used to publish results)"
            fi
          '''

          if (p == 'ios') {
            def xcrunExists = sh(returnStatus: true, script: 'which xcrun >/dev/null 2>&1') == 0
            if (!xcrunExists) {
              error("iOS prerequisite missing: 'xcrun' not found. Install Xcode command line tools.")
            }
            echo "iOS prerequisites OK"
          } else if (p == 'android') {
            def adbExists = sh(returnStatus: true, script: 'which adb >/dev/null 2>&1') == 0
            if (!adbExists) {
              error("Android prerequisite missing: 'adb' not found. Install Android SDK platform-tools.")
            }
            echo "Android prerequisites OK"
          }
        }
      }
    }

    stage('Run Tests') {
      steps {
        script {
          def p = params.PLATFORM.toLowerCase()
          echo "================ STARTING TESTS FOR: ${p.toUpperCase()} ================"
          def testResult = 0
          if (p == 'ios') {
            testResult = sh(returnStatus: true, script: 'platformName=ios npx cucumber-js')
          } else if (p == 'android') {
            testResult = sh(returnStatus: true, script: 'platformName=android npx cucumber-js')
          } else {
            testResult = sh(returnStatus: true, script: 'npx cucumber-js')
          }

          if (testResult == 0) {
            echo "TESTS PASSED"
          } else {
            echo "TESTS FAILED"
            currentBuild.result = 'UNSTABLE'
          }
        }
      }
    }
  }

  post {
    always {
      script {
        echo "================ POST-BUILD ACTIONS ================"
        echo "Stopping Appium server..."
        sh '''
          if [ -f appium.pid ]; then
            kill $(cat appium.pid) 2>/dev/null || true
            rm appium.pid
            echo "Appium server stopped"
          fi
          pkill -f appium || true
        '''

        sh '''
          echo "Listing target folder contents:"
          ls -la target || true
          echo ""
          echo "Allure results files:"
          ls -la target/allure-results/ || echo "No allure-results folder"
        '''

        archiveArtifacts artifacts: 'target/**/*', allowEmptyArchive: true

        echo "Publishing JUnit/Cucumber results (if any)..."
        junit testResults: 'target/surefire-reports/**/*.xml', allowEmptyResults: true
        echo "Cucumber JSON presence:"
        sh 'ls -la target/cucumber.json || true'

        echo "Publishing Allure Report via Jenkins Plugin..."
        allure([
          includeProperties: false,
          jdk: '',
          properties: [],
          reportBuildPolicy: 'ALWAYS',
          results: [[path: 'target/allure-results']]
        ])

        echo "================ TEST EXECUTION SUMMARY ================"
        echo "Platform: ${params.PLATFORM}"
        echo "Build Status: ${currentBuild.result ?: 'SUCCESS'}"
        echo "Duration: ${currentBuild.durationString}"
      }
    }

    success {
      echo "PIPELINE COMPLETED SUCCESSFULLY"
    }

    unstable {
      echo "PIPELINE COMPLETED WITH FAILURES"
    }

    failure {
      echo "PIPELINE FAILED"
    }

    cleanup {
      echo "Cleaning workspace..."
      cleanWs()
      echo "Cleanup complete"
    }
  }
}
