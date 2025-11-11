pipeline {
  agent any

  parameters {
    choice(name: 'PLATFORM', choices: ['android','ios','web'], description: 'Platform to test')
  }

  options {
    timestamps()
    timeout(time: 90, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  environment {
    CI = 'true'
    ANDROID_HOME = "${HOME}/Library/Android/sdk"
    ANDROID_SDK_ROOT = "${HOME}/Library/Android/sdk"
    PATH = "${HOME}/Library/Android/sdk/platform-tools:${HOME}/Library/Android/sdk/tools:${env.PATH}"
  }

  stages {
    stage('Prepare') {
      steps {
        echo "Preparing environment for platform: ${params.PLATFORM}"

        sh '''#!/bin/bash
          set +x
          source "$HOME/.nvm/nvm.sh" --no-use >/dev/null 2>&1
          nvm use 20 >/dev/null 2>&1

          echo "✅ Node: $(node -v)"
          echo "✅ npm: $(npm -v)"
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        sh '''#!/bin/bash
          set +x
          source "$HOME/.nvm/nvm.sh" --no-use >/dev/null 2>&1
          nvm use 20 >/dev/null 2>&1

          if [ -f package-lock.json ]; then
            npm ci 2>/dev/null || {
              echo "⚠️  npm ci failed, using npm install"
              rm -f package-lock.json
              npm install
            }
          else
            npm install
          fi

          echo "✅ Dependencies installed"
        '''
      }
    }

    stage('Appium') {
      when { expression { params.PLATFORM != 'web' } }
      steps {
        echo "================ APPUMIUM SETUP ================"
        sh '''#!/bin/bash
          set +x
          source "$HOME/.nvm/nvm.sh" --no-use >/dev/null 2>&1
          nvm use 20 >/dev/null 2>&1

          if ! command -v appium &> /dev/null; then
            echo "Installing Appium..."
            npm install -g appium >/dev/null 2>&1
          fi

          echo "✅ Appium: $(appium --version)"

          echo "Starting Appium server..."
          pkill -f appium || true
          mkdir -p target
          nohup appium --relaxed-security --port 4723 --log target/appium.log > target/appium.out 2>&1 &
          echo $! > appium.pid
          sleep 5

          # Wait for Appium to be ready
          for i in {1..15}; do
            if curl -s http://localhost:4723/status 2>/dev/null | grep -q "ready"; then
              echo "✅ Appium ready!"
              break
            fi
            sleep 2
          done
        '''
      }
    }

    stage('Prechecks') {
      steps {
        script {
          def p = params.PLATFORM.toLowerCase()

          sh '''#!/bin/bash
            set +x
            source "$HOME/.nvm/nvm.sh" --no-use >/dev/null 2>&1
            nvm use 20 >/dev/null 2>&1

            echo "=== Environment Check ==="
            echo "Node: $(node -v)"
            echo "npm: $(npm -v)"
            echo "Appium: $(appium --version)"
          '''

          if (p == 'android') {
            sh '''#!/bin/bash
              set +x
              export ANDROID_HOME=$HOME/Library/Android/sdk
              export ANDROID_SDK_ROOT=$ANDROID_HOME
              export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH

              echo ""
              echo "=== Android Setup ==="
              echo "ANDROID_HOME: $ANDROID_HOME"

              if [ ! -d "$ANDROID_HOME" ]; then
                echo "❌ Android SDK not found at: $ANDROID_HOME"
                exit 1
              fi
              echo "✅ Android SDK found"

              if command -v adb &> /dev/null; then
                echo "✅ adb: $(which adb)"
                adb version | head -1
                echo ""
                echo "Connected devices:"
                adb devices
              else
                echo "❌ adb not found!"
                exit 1
              fi
            '''
          } else if (p == 'ios') {
            sh '''#!/bin/bash
              set +x
              echo ""
              echo "=== iOS Setup ==="

              if ! command -v xcrun &> /dev/null; then
                echo "❌ xcrun not found"
                exit 1
              fi

              echo "✅ xcrun found"
              echo ""
              echo "Available simulators:"
              xcrun simctl list devices | grep -i "iphone" | head -5 || true
            '''
          }
        }
      }
    }

    stage('Run Tests') {
      steps {
        script {
          def p = params.PLATFORM.toLowerCase()
          echo "================ RUNNING ${p.toUpperCase()} TESTS ================"

          sh '''#!/bin/bash
            set +x
            source "$HOME/.nvm/nvm.sh" --no-use >/dev/null 2>&1
            nvm use 20 >/dev/null 2>&1
            npm run allure:clean || true
          '''

          def testResult = sh(returnStatus: true, script: """
            set +x
            source "$HOME/.nvm/nvm.sh" --no-use >/dev/null 2>&1
            nvm use 20 >/dev/null 2>&1
            echo "Running tests for platform=${p}"
            platformName=${p} npm test
          """)

          if (testResult == 0) {
            echo "✅ TESTS PASSED"
          } else {
            echo "❌ TESTS FAILED (exit code: ${testResult})"
            currentBuild.result = 'UNSTABLE'
          }
        }
      }
    }
  }

  post {
    always {
      script {
        echo "================ CLEANUP ================"
        sh '''#!/bin/bash
          set +x
          if [ -f appium.pid ]; then
            kill $(cat appium.pid) 2>/dev/null || true
            rm appium.pid
          fi
          pkill -f appium || true
          echo "✅ Appium stopped"
        '''

        sh '''#!/bin/bash
          set +x
          if [ -d target ]; then
            echo ""
            echo "=== Artifacts ==="
            ls -lh target/ 2>/dev/null || true

            if [ -d target/allure-results ]; then
              echo ""
              echo "Allure results: $(ls target/allure-results/ | wc -l) files"
            fi
          fi
        '''

        archiveArtifacts artifacts: 'target/**/*', allowEmptyArchive: true
        junit testResults: 'target/surefire-reports/**/*.xml', allowEmptyResults: true

        allure([
          includeProperties: false,
          jdk: '',
          properties: [],
          reportBuildPolicy: 'ALWAYS',
          results: [[path: 'target/allure-results']]
        ])

        echo ""
        echo "================ SUMMARY ================"
        echo "Platform: ${params.PLATFORM}"
        echo "Status: ${currentBuild.result ?: 'SUCCESS'}"
        echo "Duration: ${currentBuild.durationString}"
        echo "========================================"
      }
    }

    success { echo "✅ PIPELINE SUCCESS" }
    unstable { echo "⚠️  TESTS FAILED" }
    failure { echo "❌ PIPELINE FAILED" }
    cleanup { cleanWs() }
  }
}
