<div align="center">

<img src="https://media.licdn.com/dms/image/v2/D4E22AQEmeXTQXhK55Q/feedshare-shrink_800/feedshare-shrink_800/0/1719918648012?e=2147483647&v=beta&t=mrfVX-weqH5L2aP9oT0eKhvELdKuY4fCM_WMyhAIrO8" alt="Lydia et Sumeria Logo" width="800"/>

# 🌟 Framework de Test E2E Lydia Mobile
*La Solution de Paiement Mobile Leader en France - Depuis 2013*

</div>

## 🏢 À propos de Lydia

Créée en 2013, Lydia Solutions est devenue la référence du paiement mobile en France. Avec plus de 7 millions d'utilisateurs, notre fintech française révolutionne les transactions entre particuliers et propose une expérience bancaire innovante.

### 🚀 Notre Mission
Créer une expérience bancaire moderne et intuitive, en commençant par simplifier les paiements entre amis et la gestion des cagnottes.

### 📱 Nos Applications
- **Lydia** : Application dédiée aux remboursements entre amis et aux cagnottes
- **Sumeria** : Notre nouvelle solution bancaire innovante

[![Tests](https://img.shields.io/badge/Tests-Passing-success?style=for-the-badge&logo=github)](https://github.com/LydiaSolutions/LydiaMobile_E2E)
[![Appium](https://img.shields.io/badge/Appium-2.0-purple?style=for-the-badge&logo=appium)](https://appium.io)
[![Cucumber](https://img.shields.io/badge/Cucumber-BDD-brightgreen?style=for-the-badge&logo=cucumber)](https://cucumber.io)
[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)](https://www.java.com)
[![Maven](https://img.shields.io/badge/Maven-3.8-red?style=for-the-badge&logo=apache-maven)](https://maven.apache.org)
[![XCUITest](https://img.shields.io/badge/XCUITest-iOS-blue?style=for-the-badge&logo=apple)](https://developer.apple.com/documentation/xctest)

*Framework pour l'automatisation des tests mobiles de l'application Lydia*

[📱 About](#-about) •
[🚀 Installation](#-installation) •
[📊 Reports](#-reports) •
[📞 Contact](#-contact)

---

</div>

## 🏗️ Architecture du Framework

### 📐 Pattern de Conception
Ce framework utilise le **Page Object Model (POM)** avec une architecture en couches :

```
├── pom.xml                  # Configuration Maven et dépendances
└── src/
    └── test/
        ├── java/
        │   ├── pages/           # Page Objects
        │   │   ├── BasePage.java          # Classe de base avec méthodes communes
        │   │   ├── LydiaLoginPage.java    # Page de connexion Lydia
        │   │   └── LydiaHelpPage.java     # Page d'aide Lydia
        │   │
        │   ├── steps/           # Step Definitions Cucumber
        │   │   ├── Hooks.java             # Configuration avant/après tests
        │   │   │   ├── @Before : Configuration du driver
        │   │   │   └── @After  : Nettoyage et screenshots
        │   │   │
        │   │   └── LydiaLoginSteps.java   # Steps de login
        │   │       ├── @Given  : Conditions initiales
        │   │       ├── @When   : Actions utilisateur
        │   │       └── @Then   : Vérifications
        │   │
        │   ├── runners/         # Test Runners
        │   │   ├── CukesRunner.java       # Runner principal
        │   │   │   ├── @RunWith(Cucumber.class)
        │   │   │   └── @CucumberOptions(
        │   │   │       features = "src/test/resources/features",
        │   │   │       glue = "steps",
        │   │   │       tags = "@ios or @android",
        │   │   │       plugin = {"io.qameta.allure.cucumber7.AllureCucumber7Jvm"}
        │   │   │     )
        │   │   │
        │   │   └── FailedTestRunner.java  # Relance des tests échoués
        │   │
        │   └── utils/           # Classes utilitaires
        │       ├── Driver.java          # Factory de driver Appium
        │       ├── OS.java              # Gestion iOS/Android
        │       └── ConfigReader.java    # Lecture des properties
        │
        └── resources/
            ├── features/        # Fichiers features Cucumber
            │   └── lydia_login.feature    # Scénarios BDD
            │       ├── @ios     : Tests iOS
            │       └── @android : Tests Android
            │
            └── config/
                └── configuration.properties # Configuration du framework
```

#### 📦 pom.xml - Dépendances Principales
```xml
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <cucumber.version>7.14.0</cucumber.version>
    <appium.version>9.3.0</appium.version>
    <allure.version>2.24.0</allure.version>
</properties>

<dependencies>
    <!-- Appium -->
    <dependency>
        <groupId>io.appium</groupId>
        <artifactId>java-client</artifactId>
        <version>${appium.version}</version>
    </dependency>

    <!-- Cucumber -->
    <dependency>
        <groupId>io.cucumber</groupId>
        <artifactId>cucumber-java</artifactId>
        <version>${cucumber.version}</version>
    </dependency>
    <dependency>
        <groupId>io.cucumber</groupId>
        <artifactId>cucumber-junit</artifactId>
        <version>${cucumber.version}</version>
    </dependency>

    <!-- Allure Reports -->
    <dependency>
        <groupId>io.qameta.allure</groupId>
        <artifactId>allure-cucumber7-jvm</artifactId>
        <version>${allure.version}</version>
    </dependency>
</dependencies>
```
```

### 🛠️ Composants Clés

#### 🔄 OS.java
Classe utilitaire cruciale pour la gestion cross-platform :
- Détection automatique de la plateforme (iOS/Android)
- Configuration spécifique par plateforme
- Gestion des localisateurs adaptés

#### 📱 BasePage.java
Classe fondamentale contenant :
- Méthodes communes de manipulation d'éléments
- Gestion des attentes (explicit/implicit waits)
- Actions gestuelles (swipe, scroll, etc.)
- Gestion du clavier virtuel

#### 🎭 Page Objects
Implémentation du POM avec :
- Encapsulation des localisateurs
- Méthodes d'action spécifiques
- Vérifications métier

### 🔄 CI/CD Pipeline
Integration continue via Jenkins :
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean'
            }
        }
        stage('Test') {
            parallel {
                stage('Android') {
                    steps {
                        sh 'mvn test -DplatformName=android'
                    }
                }
                stage('iOS') {
                    steps {
                        sh 'mvn test -DplatformName=ios'
                    }
                }
            }
        }
        stage('Report') {
            steps {
                allure([
                    includeProperties: false,
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'target/allure-results']]
                ])
            }
        }
    }
}

## ⚡ Technologies Used
- 🌐 **Selenium**: Automated web testing
- 📱 **Appium**: Automated mobile testing
- 🥒 **Cucumber**: BDD specifications
- ☕ **Java**: Programming language
- 🎯 **Maven**: Dependency management
- 🧪 **JUnit**: Testing framework
- 📊 **Allure**: Test reporting

## 🔧 Technologies et Méthodologies

### 💻 Stack Technique
- **Langage** : Java
- **Framework de Test** : 
  - Appium 2.0
  - Cucumber
  - JUnit
- **Outils** :
  - Maven (Build et Dépendances)
  - Allure (Reporting)
  - XCode & Android Studio

### 🔄 Process d'Automatisation
1. **Structure du Framework**
   - Page Object Model (POM)
   - Base Page avec méthodes communes
   - Utils pour gestion cross-platform (iOS/Android)

2. **Implémentation**
   - Scénarios Cucumber en Gherkin
   - Step Definitions en Java
   - Page Objects pour chaque écran

3. **Exécution**
   - Tests iOS via XCUITest
   - Tests Android via UiAutomator2
   - Gestion des environnements via properties

4. **Reporting**
   - Rapports détaillés Allure
   - Screenshots automatiques
   - Logs d'exécution

## 📋 Prerequisites

### 🌐 Web Tests
- ☕ Java JDK 17
- 🎯 Maven 3.8.x+
- 🌐 Browsers:
  - Chrome
  - Firefox
  - Safari
  - Edge

### 📱 Mobile Tests
- 💻 Node.js and npm
- 📱 Appium 2.0+
- 🤖 Android Studio & SDK
- 🍎 Xcode (for iOS)

## 🚀 Installation

### 1. 📥 Clone the repository
```bash
git clone https://github.com/hakantetik44/WiglMobile_E2E.git
cd WiglMobile_E2E
```

### 2. 📦 Install dependencies
```bash
mvn clean install
```

### 3. ⚙️ Configuration

#### 🌐 Web
Edit `src/test/resources/configuration.properties` to set web testing parameters.

#### 📱 Mobile
Edit `src/test/resources/configuration.properties` to set mobile testing parameters:

##### Android Configuration
```properties
android.platform.name=Android
android.platform.version=11
android.device.name=sdk_gphone_x86
android.udid=emulator-5554
android.app.package=com.lydia
android.app.activity=com.lydia.MainActivity
android.no.reset=true
android.auto.grant.permissions=true
android.automation.name=UiAutomator2
```

##### iOS Configuration
```properties
ios.platform.name=iOS
ios.platform.version=18.3.1
ios.device.name=iPhone
ios.udid=your-device-udid
ios.bundle.id=com.bps.wigl
ios.automation.name=XCUITest
```

## ▶️ Running Tests

### 🎯 All tests
```bash
mvn clean test -Dcucumber.filter.tags="@all"
```

### 🌐 Web Tests
```bash
mvn test -Dplatform=web -Dcucumber.filter.tags="@web"
```

### 📱 Mobile Tests
```bash
# Android
mvn test -DplatformName=android -Dcucumber.filter.tags="@android"

# iOS
mvn test -DplatformName=ios -Dcucumber.filter.tags="@ios"
```

### 🏷️ Tests by Module
```bash
# Login tests
mvn test -Dcucumber.filter.tags="@login"

# Registration tests
mvn test -Dcucumber.filter.tags="@registration"

# Payment tests
mvn test -Dcucumber.filter.tags="@payment"
```

## 📱 iOS Testing Specifics

### WebDriverAgent Setup
For iOS testing, WebDriverAgent needs to be properly set up:

1. Install WebDriverAgent:
   ```bash
   npm install -g appium
   appium driver install xcuitest
   ```

2. Open WebDriverAgent in Xcode:
   ```bash
   open -a Xcode ~/.appium/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj
   ```

3. Configure WebDriverAgent:
   - Select the WebDriverAgentRunner scheme
   - Choose your iOS device as the target
   - Update the signing team to your Apple Developer account
   - Build the project (⌘+B)

4. Trust the developer certificate on your iOS device:
   - Go to Settings > General > Device Management
   - Select your Apple Developer account
   - Tap "Trust"

5. Run WebDriverAgentRunner directly on your device:
   - Launch the WebDriverAgentRunner app on your device
   - Ensure it's running before starting Appium tests

## 🤖 Android Testing Specifics

1. Set up Android SDK:
   ```bash
   sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3"
   ```

2. Create and start an emulator:
   ```bash
   avdmanager create avd -n test_device -k "system-images;android-30;google_apis;x86_64"
   emulator -avd test_device
   ```

3. Install the Wigl app:
   ```bash
   adb install -r path/to/wigl.apk
   ```

4. Grant necessary permissions:
   ```bash
   adb shell pm grant com.bps.wigl android.permission.ACCESS_FINE_LOCATION
   ```

## 📊 Reports and Analysis

### 📈 Allure Reports
Allure reports are automatically generated in `target/allure-results` and include:
- Test overview
- Error screenshots
- Detailed execution time
- Quality metrics
- Execution history

Pour exécuter les tests et générer/ouvrir automatiquement le rapport Allure :
```bash
mvn clean test -DplatformName=ios && allure generate target/allure-results -o target/allure-report --clean && allure open target/allure-report
```

Ou utilisez la méthode traditionnelle pour voir les rapports existants :
```bash
allure serve target/allure-results
```

### 📑 Cucumber Reports
Cucumber reports are available in `target/cucumber-reports`:
- Interactive HTML reports
- JSON reports for CI/CD integration
- XML reports for trend analysis

To open the HTML report:
```bash
open target/cucumber-reports/index.html
```

## 🔄 Continuous Integration (CI/CD)

The project can be integrated with CI/CD systems like Jenkins for automated testing.

## 🤝 Contribution
1. 🔀 Fork the project
2. 🌿 Create a branch (`git checkout -b feature/AmazingFeature`)
3. ✍️ Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔍 Open a Pull Request

## 📞 Contact
- 🌐 **Site Web**: [www.lydia-app.com](https://www.lydia-app.com)
- 📧 **Email**: support@lydia-app.com

<div align="center">

---

# 💳 LYDIA 💰
*Le Paiement Mobile Simplifié*

*Développé avec ❤️ par l'équipe QA de Lydia*

</div>
# LydiaMobile_E2E
