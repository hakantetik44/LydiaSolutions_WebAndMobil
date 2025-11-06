<div align="center">

<img src="https://media.licdn.com/dms/image/v2/D4E22AQEmeXTQXhK55Q/feedshare-shrink_800/feedshare-shrink_800/0/1719918648012?e=2147483647&v=beta&t=mrfVX-weqH5L2aP9oT0eKhvELdKuY4fCM_WMyhAIrO8" alt="Lydia et Sumeria Logo" width="800"/>

# 🌟 Lydia Mobile E2E

[![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat-square)](https://github.com/hakantetik44/LydiaMobile_E2E)
[![Appium](https://img.shields.io/badge/Appium-2.x-purple?style=flat-square)](https://appium.io)
[![Cucumber](https://img.shields.io/badge/Cucumber-BDD-brightgreen?style=flat-square)](https://cucumber.io)
[![Allure](https://img.shields.io/badge/Allure-Reports-orange?style=flat-square)](https://docs.qameta.io/allure/)

</div>

---

## 📱 À Propos

**Lydia Solutions** (2013) - Leader français du paiement mobile avec **+7 millions d'utilisateurs**. Framework d'automatisation E2E pour tester les applications mobiles Lydia et Sumeria.

### 🎯 Stack Technique

| Tech | Version | Usage |
|------|---------|-------|
| Java | 17 | Langage principal |
| Maven | 3.8+ | Build & dépendances |
| Appium | 2.x | Automation mobile |
| Cucumber | 7.14.0 | BDD (Gherkin) |
| Allure | 2.24.0 | Reporting |

---

## 🏗️ Architecture - Page Object Model

```
┌─────────────────────────────────────────────┐
│  FEATURES (Cucumber .feature files)         │
│  • Scénarios Gherkin avec tags @ios/@android│
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│  STEP DEFINITIONS                           │
│  • LydiaLoginSteps.java                     │
│  • Hooks.java (@Before/@After)              │
│  • Annotations @Step pour Allure            │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│  PAGE OBJECTS                               │
│  • BasePage.java (méthodes communes)        │
│  • LydiaLoginPage.java (locators + actions) │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│  UTILITIES                                  │
│  • Driver.java (Factory Singleton)          │
│  • OS.java (détection plateforme)           │
│  • ConfigReader.java                        │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│  APPIUM DRIVER                              │
│  • AndroidDriver / IOSDriver                │
└─────────────────────────────────────────────┘
```

---

## 📂 Structure du Projet

```
LydiaMobile_E2E/
├── pom.xml                           # Maven config
├── Jenkinsfile                       # Pipeline CI/CD
├── src/test/
│   ├── java/
│   │   ├── pages/                   # Page Objects
│   │   ├── stepDefinitions/         # Steps Cucumber
│   │   ├── runners/                 # Test Runners
│   │   └── utils/                   # Utilitaires
│   └── resources/
│       ├── features/                # Fichiers .feature
│       ├── configuration.properties # Config Appium
│       ├── allure.properties        # Config Allure
│       └── categories.json          # Catégories erreurs
└── target/
    ├── allure-results/              # Résultats Allure
    └── allure-report/               # Rapport HTML
```

---

## 🚀 Installation

### Prérequis

```bash
# Java 17
brew install --cask temurin17

# Maven
brew install maven

# Node.js & npm
brew install node

# Appium
npm install -g appium

# Drivers Appium
appium driver install xcuitest      # iOS
appium driver install uiautomator2  # Android

# Allure (pour rapports)
brew install allure
```

### Installation Projet

```bash
git clone https://github.com/hakantetik44/LydiaMobile_E2E.git
cd LydiaMobile_E2E
mvn clean install -DskipTests
```

### Configuration

Éditer `src/test/resources/configuration.properties` :

```properties
# iOS
ios.platform.version=18.3.1
ios.udid=VOTRE-UDID
ios.bundle.id=com.lydia-app

# Android
android.platform.version=11
android.udid=emulator-5554
android.app.package=com.lydia-app
```

---

## ▶️ Exécution

### Tests iOS

```bash
# Démarrer Appium (terminal séparé)
appium

# Lancer tests
mvn clean test -DplatformName=ios
```

### Tests Android

```bash
# Démarrer émulateur
emulator -avd Pixel_5_API_30

# Démarrer Appium
appium

# Lancer tests
mvn clean test -DplatformName=android
```

### Avec Rapport Allure

```bash
mvn clean test -DplatformName=ios && \
allure generate target/allure-results -o target/allure-report --clean && \
allure open target/allure-report
```

---

## 🐛 Troubleshooting Allure

### Rapport Vide ("Loading...") ?

**Solutions** :

1. **Vérifier les résultats générés** :
   ```bash
   ls -la target/allure-results/*.json
   ```

2. **S'assurer que les annotations @Step existent** :
   ```java
   @Step("Clic sur {bouton}")
   @When("l'utilisateur clique sur {string}")
   public void clic(String bouton) { ... }
   ```

3. **Vérifier le plugin Allure dans CukesRunner.java** :
   ```java
   @CucumberOptions(
       plugin = {
           "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm"
       }
   )
   ```

4. **Regénérer complètement** :
   ```bash
   rm -rf target/allure-*
   mvn clean test -DplatformName=ios
   allure generate target/allure-results --clean
   allure open target/allure-report
   ```

---

## 🎯 Pipeline Jenkins

Le `Jenkinsfile` inclus gère automatiquement :
- ✅ Installation Appium si absent
- ✅ Démarrage serveur Appium
- ✅ Exécution tests par plateforme
- ✅ Génération rapport Allure
- ✅ Archivage artefacts

**Usage dans Jenkins** :
1. Créer un Pipeline Job
2. Pointer vers ce dépôt Git
3. Sélectionner `PLATFORM` (ios/android)
4. Build

---

## 📊 Rapports Allure

Le rapport inclut :
- 📈 **Overview** : Statistiques
- 🏷️ **Categories** : Erreurs catégorisées
- 📂 **Suites** : Tests par feature
- 📊 **Graphs** : Visualisations
- ⏱️ **Timeline** : Durée d'exécution

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Commit (`git commit -m 'Ajout feature'`)
4. Push (`git push origin feature/ma-feature`)
5. Pull Request

---

<div align="center">

**Fait avec ❤️ pour Lydia Solutions**

[🌐 Site Web](https://lydia-app.com) • [📧 Contact](mailto:contact@lydia-app.com)

</div>

# LydiaMobile_E2E_TypeScript
