<div align="center">

<img src="https://media.licdn.com/dms/image/v2/D4E22AQEmeXTQXhK55Q/feedshare-shrink_800/feedshare-shrink_800/0/1719918648012?e=2147483647&v=beta&t=mrfVX-weqH5L2aP9oT0eKhvELdKuY4fCM_WMyhAIrO8" alt="Lydia et Sumeria Logo" width="800"/>

# 🌟 Lydia Mobile E2E - Framework d'automatisation

</div>

## À propos

Créée en 2013, Lydia Solutions est la référence française du paiement mobile entre amis. Ce dépôt contient un framework d'automatisation UI mobile (Appium + Cucumber + JUnit) conçu pour tester l'application mobile Lydia / Sumeria.

---

## Objectif du repo

Fournir un framework stable et réutilisable pour l'automatisation des tests mobile :
- Page Object Model (POM) pour séparer la logique des pages et les étapes
- Step definitions Cucumber pour décrire les scénarios en Gherkin
- Génération de rapports Allure

## Structure principale

```
pom.xml
src/
  test/
    java/
      pages/        # Page Objects (BasePage + pages spécifiques)
      stepDefinitions/ # Step Definitions Cucumber
      runners/      # Runners JUnit / Cucumber
      utils/        # Driver, OS, Config utilities
    resources/
      features/     # Fichiers .feature
      config/       # configuration.properties
```

## Prérequis

- Java JDK 17
- Maven 3.8+
- Node.js + npm (pour Appium)
- Appium 2.x installé globalement (optionnel localement)
- Android SDK / Xcode selon la plateforme
- Allure CLI (pour générer/ouvrir facilement les rapports)

## Configuration

Éditez `src/test/resources/configuration.properties` pour définir les capacités (deviceName, platformVersion, udid, bundleId / appPackage, automationName...). Exemple iOS (à adapter) :

```
platformName=iOS
appium:automationName=XCUITest
appium:deviceName=iPhone
appium:platformVersion=16.4
appium:udid=00008101-000A3DA60CD1003A
appium:bundleId=com.lydia-app
```

## Lancer les tests

- Exécuter tous les tests (par défaut utilise les tags définis dans les runners) :

```bash
mvn clean test -DplatformName=ios
# ou pour Android
mvn clean test -DplatformName=android
```

- Générer et ouvrir le rapport Allure (commande recommandée) :

```bash
mvn clean test -DplatformName=ios && \
allure generate target/allure-results -o target/allure-report --clean && \
allure open target/allure-report
```

ou pour une visualisation rapide sans génération persistante :

```bash
allure serve target/allure-results
```

## Notes importantes

- Ne pas ajouter de pratiques non utilisées dans le framework (ex: 3amos / méthodes non présentes). Le README doit refléter ce qui est réellement implémenté.
- Les actions communes (click, wait, scroll, hideKeyboard, etc.) sont centralisées dans `pages/BasePage.java`. Les pages spécifiques (p.ex. `LydiaLoginPage`) utilisent ces méthodes.
- Pour iOS, vérifiez que WebDriverAgent est correctement provisionné si vous utilisez un device réel.

## CI / Jenkins

Le projet est prévu pour fonctionner avec un pipeline Jenkins minimal : appeler Maven en passant `-DplatformName=ios` ou `-DplatformName=android`, puis archiver les artefacts et générer Allure si `target/allure-results` existe. Le `Jenkinsfile` du repo a été simplifié et ne contient pas de gros scripts d'installation (prérequis à préparer sur l'agent Jenkins).

## Offre d'emploi (contexte)

Le dépôt contient également un extrait d'annonce pour un poste QA Engineer chez Lydia Solutions — cela sert de contexte métier pour les scénarios de test (gestion d'identité, login, issues client...).

---

Si tu veux, je peux :
- Ajouter un résumé des classes manquantes et créer des squelettes (BasePage, LydiaLoginPage) si elles n'existent pas
- Exécuter un `mvn -q -DskipTests=false test` localement (si tu veux que je lance ici)
- Pousser ces changements sur ta branche (si tu me demandes explicitement)
