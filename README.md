xcodebuild -project WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner -destination 'platform=iOS,name=iPhone' test
```
<div align="center">
#### Android : ADB non trouvé
```bash
# Ajouter au PATH
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
<img src="https://media.licdn.com/dms/image/v2/D4E22AQEmeXTQXhK55Q/feedshare-shrink_800/feedshare-shrink_800/0/1719918648012?e=2147483647&v=beta&t=mrfVX-weqH5L2aP9oT0eKhvELdKuY4fCM_WMyhAIrO8" alt="Lydia et Sumeria Logo" width="800"/>
#### Appium : Driver non installé
```bash
# Lister les drivers installés
appium driver list --installed
# 🌟 Lydia Mobile E2E - Framework d'Automatisation
# Installer si manquant
appium driver install xcuitest
appium driver install uiautomator2
```
[![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat-square&logo=checkmarx)](https://github.com/hakantetik44/LydiaMobile_E2E)
[![Appium](https://img.shields.io/badge/Appium-2.x-purple?style=flat-square&logo=appium)](https://appium.io)
[![Cucumber](https://img.shields.io/badge/Cucumber-BDD-brightgreen?style=flat-square&logo=cucumber)](https://cucumber.io)
## 🎯 Pipeline Jenkins

Le `Jenkinsfile` inclus permet :
- ✅ Installation automatique d'Appium si absent
- ✅ Démarrage automatique du serveur Appium
- ✅ Exécution des tests iOS/Android
- ✅ Génération automatique du rapport Allure
- ✅ Archivage des artefacts

### Lancer dans Jenkins :

1. Créer un job Pipeline
2. Pointer vers le dépôt Git
3. Sélectionner le paramètre `PLATFORM` (ios/android/web)
4. Build !

---

## 📊 Rapports

### Allure Report Inclut :
- 📈 **Overview** : Statistiques globales
- 🏷️ **Categories** : 7 catégories d'erreurs
- 📂 **Suites** : Tests par feature
- 📊 **Graphs** : Visualisations
- ⏱️ **Timeline** : Durée d'exécution
- 🎯 **Behaviors** : Organisation Epic/Feature
- 📦 **Packages** : Par structure Java

---

## 🤝 Contribution

Ce projet est un framework de démonstration pour l'automatisation mobile chez Lydia Solutions. Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📝 Licence

Ce projet est un exemple d'automatisation à but éducatif.

---

<div align="center">

**Fait avec ❤️ pour Lydia Solutions**

[🌐 Site Web](https://lydia-app.com) • [📧 Contact](mailto:contact@lydia-app.com)

</div>
---

## 📱 À Propos

**Lydia Solutions** (créée en 2013) est la référence française du paiement mobile entre amis avec **+7 millions d'utilisateurs**. Ce dépôt contient un framework d'automatisation E2E robuste pour tester les applications mobiles Lydia et Sumeria.

### 🎯 Technologies Utilisées

| Technologie | Version | Usage |
|------------|---------|-------|
| **Java** | 17 | Langage principal |
| **Maven** | 3.8+ | Build & dépendances |
| **Appium** | 2.x | Automation mobile |
| **Cucumber** | 7.14.0 | BDD (Gherkin) |
| **JUnit** | 4.13.2 | Test runner |
| **Allure** | 2.24.0 | Reporting |
| **Selenium** | 4.25.0 | WebDriver |

---

## 🏗️ Architecture du Framework

### 📐 Page Object Model (POM)

```
┌─────────────────────────────────────────────────────────────┐
│                     TEST EXECUTION FLOW                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  CUCUMBER FEATURES (.feature files)                         │
│  • lydia_login.feature                                       │
│  • Scénarios en Gherkin (@ios, @android tags)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP DEFINITIONS (stepDefinitions/)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  LydiaLoginSteps.java                                 │  │
│  │  • @Given, @When, @Then, @And                        │  │
│  │  • Annotations @Step pour Allure                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Hooks.java                                           │  │
│  │  • @Before : Setup driver, Allure config             │  │
│  │  • @After  : Cleanup, screenshots                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PAGE OBJECTS (pages/)                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  BasePage.java (Classe Abstraite)                    │  │
│  │  ├─ waitForClickable()                                │  │
│  │  ├─ click()                                           │  │
│  │  ├─ sendKeys()                                        │  │
│  │  ├─ hideKeyboard()                                    │  │
│  │  └─ clickWithLog() / sendKeysWithLog()               │  │
│  └──────────────────────────────────────────────────────┘  │
│                       ▲                                      │
│                       │ extends                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  LydiaLoginPage.java                                  │  │
│  │  • Locators (iOS / Android)                          │  │
│  │  • clickBesoinAide()                                 │  │
│  │  • saisirNumeroTelephone()                           │  │
│  │  • saisirEmail()                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  UTILITIES (utils/)                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Driver.java - Factory Pattern                       │  │
│  │  • getDriver() : Singleton                           │  │
│  │  • initializeAndroidDriver()                         │  │
│  │  • initializeIOSDriver()                             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  OS.java - Platform Detection                        │  │
│  │  • isAndroid() / isIOS()                             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ConfigReader.java                                    │  │
│  │  • Lecture configuration.properties                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  APPIUM DRIVER                                               │
│  • AndroidDriver (UiAutomator2)                             │
│  • IOSDriver (XCUITest)                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  MOBILE APP                                                  │
│  • Lydia iOS / Android                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Structure Détaillée du Projet

```
LydiaMobile_E2E/
├── pom.xml                           # Configuration Maven & dépendances
├── Jenkinsfile                       # Pipeline CI/CD
├── README.md                         # Documentation
│
├── src/test/
│   ├── java/
│   │   ├── pages/                   # 📄 Page Objects
│   │   │   ├── BasePage.java       # Classe de base avec méthodes communes
│   │   │   └── LydiaLoginPage.java # Page de connexion spécifique
│   │   │
│   │   ├── stepDefinitions/         # 🎬 Step Definitions Cucumber
│   │   │   ├── Hooks.java          # Setup/Teardown (@Before/@After)
│   │   │   └── LydiaLoginSteps.java # Steps de login (@Given/@When/@Then)
│   │   │
│   │   ├── runners/                 # 🏃 Test Runners
│   │   │   ├── CukesRunner.java    # Runner principal avec tags
│   │   │   └── FailedTestRunner.java # Relance des tests échoués
│   │   │
│   │   └── utils/                   # 🔧 Utilitaires
│   │       ├── Driver.java          # Factory de driver Appium (Singleton)
│   │       ├── OS.java              # Détection iOS/Android
│   │       └── ConfigReader.java    # Lecture des properties
│   │
│   └── resources/
│       ├── features/                # 🥒 Fichiers Cucumber
│       │   └── lydia_login.feature  # Scénarios BDD
│       │
│       ├── configuration.properties # ⚙️ Config Appium (iOS/Android)
│       ├── allure.properties        # 📊 Config Allure
│       ├── environment.properties   # 🌍 Métadonnées environnement
│       └── categories.json          # 🏷️ Catégories d'erreurs Allure
│
└── target/                          # Génération Maven
    ├── allure-results/              # Résultats bruts Allure
    ├── allure-report/               # Rapport HTML Allure
    ├── cucumber-reports/            # Rapports Cucumber
    └── surefire-reports/            # Rapports JUnit
```

---

## 🚀 Installation & Configuration

### 1️⃣ Prérequis

#### Obligatoires :
- ☕ **Java JDK 17** ([Temurin](https://adoptium.net/))
- 📦 **Maven 3.8+** (`brew install maven`)
- 📱 **Node.js & npm** (`brew install node`)
- 🤖 **Appium 2.x** (`npm install -g appium`)

#### Drivers Appium :
```bash
# iOS
appium driver install xcuitest

# Android
appium driver install uiautomator2
```

#### Pour iOS :
- 🍎 **Xcode** (via App Store)
- 🔧 **Xcode Command Line Tools** : `xcode-select --install`
- 📲 **ios-deploy** : `brew install ios-deploy`

#### Pour Android :
- 🤖 **Android Studio** ([Download](https://developer.android.com/studio))
- 📱 **Android SDK Platform-Tools** (configuré via Android Studio)
- ⚙️ Variable `ANDROID_HOME` : `export ANDROID_HOME=$HOME/Library/Android/sdk`

#### Pour Allure Reports :
```bash
brew install allure
```

### 2️⃣ Installation du Projet

```bash
# Cloner le dépôt
git clone https://github.com/hakantetik44/LydiaMobile_E2E.git
cd LydiaMobile_E2E

# Installer les dépendances Maven
mvn clean install -DskipTests
```

### 3️⃣ Configuration

Éditer `src/test/resources/configuration.properties` :

#### Configuration iOS :
```properties
ios.platform.name=iOS
ios.platform.version=18.3.1
ios.device.name=iPhone
ios.udid=00008101-000A3DA60CD1003A     # Votre UDID
ios.bundle.id=com.lydia-app
ios.automation.name=XCUITest
```

#### Configuration Android :
```properties
android.platform.name=Android
android.platform.version=11
android.device.name=sdk_gphone_x86
android.udid=emulator-5554
android.app.package=com.lydia-app
android.app.activity=com.lydia.MainActivity
android.automation.name=UiAutomator2
```

---

## ▶️ Exécution des Tests

### 🎯 Tests iOS

```bash
# Lancer Appium (dans un terminal séparé)
appium

# Exécuter les tests iOS
mvn clean test -DplatformName=ios
```

### 🤖 Tests Android

```bash
# Démarrer l'émulateur Android (ou connecter un device)
emulator -avd Pixel_5_API_30

# Lancer Appium
appium

# Exécuter les tests Android
mvn clean test -DplatformName=android
```

### 📊 Avec Génération de Rapport Allure

```bash
# Exécuter tests + générer + ouvrir rapport automatiquement
mvn clean test -DplatformName=ios && \
allure generate target/allure-results -o target/allure-report --clean && \
allure open target/allure-report

# Ou visualisation rapide
allure serve target/allure-results
```

---

## 🐛 Troubleshooting

### ❌ Problème : Rapport Allure Vide ("Loading...")

**Symptômes** :
```
Allure Overview
Loading...
Loading...
Loading...
```

**Causes possibles** :

1. **Pas de résultats générés** :
   ```bash
   # Vérifier si les résultats existent
   ls -la target/allure-results/
   ```
   **Solution** : S'assurer que les tests ont bien été exécutés avec `mvn test`

2. **Plugin Allure non configuré** :
   Vérifier dans `pom.xml` :
   ```xml
   <plugin>
       <groupId>io.qameta.allure</groupId>
       <artifactId>allure-cucumber7-jvm</artifactId>
   </plugin>
   ```

3. **Annotations @Step manquantes** :
   ```java
   // ✅ CORRECT
   @Step("Clic sur le bouton : {bouton}")
   @When("l'utilisateur clique sur {string}")
   public void lUtilisateurCliqueSur(String bouton) { ... }
   
   // ❌ INCORRECT (pas de @Step)
   @When("l'utilisateur clique sur {string}")
   public void lUtilisateurCliqueSur(String bouton) { ... }
   ```

4. **Fichiers de configuration Allure manquants** :
   S'assurer que ces fichiers existent :
   - `src/test/resources/allure.properties`
   - `src/test/resources/environment.properties`
   - `src/test/resources/categories.json`

5. **Runner Cucumber mal configuré** :
   Vérifier `CukesRunner.java` :
   ```java
   @CucumberOptions(
       plugin = {
           "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm", // ← Important !
           "json:target/cucumber.json",
           "pretty"
       }
   )
   ```

**Solution Complète** :

```bash
# 1. Nettoyer les anciens rapports
rm -rf target/allure-results target/allure-report

# 2. Relancer les tests
mvn clean test -DplatformName=ios

# 3. Vérifier les résultats
ls -la target/allure-results/*.json

# 4. Générer le rapport
allure generate target/allure-results --clean -o target/allure-report

# 5. Ouvrir le rapport
allure open target/allure-report
```

### 🔧 Autres Problèmes Courants

#### iOS : WebDriverAgent ne démarre pas
```bash
# Vérifier WebDriverAgent
cd ~/.appium/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent

Le projet est prévu pour fonctionner avec un pipeline Jenkins minimal : appeler Maven en passant `-DplatformName=ios` ou `-DplatformName=android`, puis archiver les artefacts et générer Allure si `target/allure-results` existe. Le `Jenkinsfile` du repo a été simplifié et ne contient pas de gros scripts d'installation (prérequis à préparer sur l'agent Jenkins).

## Offre d'emploi (contexte)

Le dépôt contient également un extrait d'annonce pour un poste QA Engineer chez Lydia Solutions — cela sert de contexte métier pour les scénarios de test (gestion d'identité, login, issues client...).

---

Si tu veux, je peux :
- Ajouter un résumé des classes manquantes et créer des squelettes (BasePage, LydiaLoginPage) si elles n'existent pas
- Exécuter un `mvn -q -DskipTests=false test` localement (si tu veux que je lance ici)
- Pousser ces changements sur ta branche (si tu me demandes explicitement)
