# Mapping Java vers TypeScript

Ce document détaille la conversion de chaque classe Java en TypeScript.

## Classes Converties

### 1. Utils

#### OS.java → OS.ts
- **Localisation**: `src/test/java/utils/OS.java` → `src/test/typescript/utils/OS.ts`
- **Changements**:
  - `System.getProperty()` → `process.env`
  - Types statiques ajoutés
  - Méthodes statiques conservées

#### ConfigReader.java → ConfigReader.ts
- **Localisation**: `src/test/java/utils/ConfigReader.java` → `src/test/typescript/utils/ConfigReader.ts`
- **Changements**:
  - `Properties` → `Map<string, string>`
  - `FileInputStream` → `fs.readFileSync()`
  - Parsing manuel des fichiers .properties
  - Block static → static initialization

#### Driver.java → Driver.ts
- **Localisation**: `src/test/java/utils/Driver.java` → `src/test/typescript/utils/Driver.ts`
- **Changements**:
  - `AppiumDriver` → `WebdriverIO.Browser`
  - `ThreadLocal<WebDriver>` → static variable
  - `UiAutomator2Options/XCUITestOptions` → `RemoteOptions` avec capabilities
  - Méthodes synchrones → async/await
  - `Duration` → millisecondes
  - Utilisation de webdriverio au lieu d'Appium Java Client

### 2. Pages

#### BasePage.java → BasePage.ts
- **Localisation**: `src/test/java/pages/BasePage.java` → `src/test/typescript/pages/BasePage.ts`
- **Changements**:
  - `WebDriver` → `WebdriverIO.Browser`
  - `WebDriverWait` → méthodes natives de WebdriverIO
  - `By` locators → sélecteurs string
  - `WebElement` → `WebdriverIO.Element`
  - Toutes les méthodes sont async
  - `AndroidDriver.hideKeyboard()` → `driver.hideKeyboard()`
  - `ExpectedConditions` → `element.waitForClickable()` / `element.waitForDisplayed()`

#### LydiaLoginPage.java → LydiaLoginPage.ts
- **Localisation**: `src/test/java/pages/LydiaLoginPage.java` → `src/test/typescript/pages/LydiaLoginPage.ts`
- **Changements**:
  - Extension de BasePage conservée
  - `AppiumBy.xpath()` → string XPath direct
  - `AppiumBy.iOSClassChain()` → string iOSClassChain direct
  - `AppiumBy.accessibilityId()` → format `~accessibilityId`
  - Méthode `init()` async pour initialiser le driver
  - Toutes les actions sont async

### 3. Step Definitions

#### Hooks.java → Hooks.ts
- **Localisation**: `src/test/java/stepDefinitions/Hooks.java` → `src/test/typescript/stepDefinitions/Hooks.ts`
- **Changements**:
  - Annotations Cucumber Java → décorateurs TypeScript (`@Before`, `@After`)
  - `Scenario` → `ITestCaseHookParameter`
  - `Runtime.getRuntime().exec()` → `child_process.exec()` avec promisify
  - `Allure` integration simplifiée (attachments seulement)
  - `Thread.sleep()` → `await new Promise(resolve => setTimeout())`
  - `TakesScreenshot` → `driver.takeScreenshot()`
  - Méthodes async pour toutes les opérations

#### LydiaLoginSteps.java → LydiaLoginSteps.ts
- **Localisation**: `src/test/java/stepDefinitions/LydiaLoginSteps.java` → `src/test/typescript/stepDefinitions/LydiaLoginSteps.ts`
- **Changements**:
  - Annotations Cucumber → décorateurs (`@Given`, `@When`, `@Then`, `@And`)
  - `@Step` Allure → commentaires (Allure TypeScript supporte différemment)
  - `Assert.assertNotNull()` → `expect().to.not.be.null` (Chai)
  - Instance de page créée globalement
  - Toutes les step definitions sont async
  - `WebDriverWait` → méthodes natives `waitForClickable()`

### 4. Runners

#### CukesRunner.java → cucumber.config.ts + cucumber.js
- **Localisation**: `src/test/java/runners/CukesRunner.java` → `src/test/typescript/runners/cucumber.config.ts` + `cucumber.js`
- **Changements**:
  - `@RunWith(Cucumber.class)` → Configuration JavaScript
  - `@CucumberOptions` → objet de configuration
  - Plugins → format options
  - Tags gérés via configuration
  - Pas besoin de JUnit runner

## Nouvelles Dépendances

### TypeScript
- `typescript` - Compilateur TypeScript
- `ts-node` - Exécution directe de TypeScript
- `@types/node` - Types Node.js

### Testing
- `@cucumber/cucumber` - Framework Cucumber pour Node.js
- `webdriverio` - Client WebDriver
- `chai` + `@types/chai` - Library d'assertions

### WebDriver
- `@wdio/globals` - Types globaux WebdriverIO
- `@wdio/appium-service` - Service Appium pour WDIO

## Fichiers de Configuration

### Nouveaux Fichiers
- `tsconfig.json` - Configuration TypeScript
- `package.json` - Dépendances Node.js
- `cucumber.js` - Configuration Cucumber
- `run_tests_typescript.sh` - Script de lancement

### Fichiers Conservés
- `src/test/resources/configuration.properties` - Configuration des devices
- `src/test/resources/features/` - Fichiers feature Cucumber (inchangés)

## Différences Principales

1. **Asynchrone**: Toutes les opérations WebDriver sont async en TypeScript
2. **Types**: TypeScript offre une vérification de types au moment de la compilation
3. **Imports**: ES6 modules au lieu de imports Java
4. **WebDriver**: WebdriverIO au lieu de Selenium/Appium Java Client
5. **Promises**: Utilisation de async/await partout
6. **Configuration**: Fichiers JavaScript/JSON au lieu d'annotations Java

## Exécution

### Java (original)
```bash
mvn test -DplatformName=android
```

### TypeScript (converti)
```bash
npm run test:android
# ou
platformName=android npm test
```

## Compatibilité

- ✅ Tous les localisateurs Android/iOS fonctionnent de la même manière
- ✅ La logique métier est identique
- ✅ Les step definitions Cucumber sont compatibles
- ✅ Les fichiers feature sont réutilisés sans modification
- ✅ Le fichier de configuration properties est réutilisé

## Notes

- Les rapports Allure nécessitent une configuration supplémentaire pour TypeScript
- Le support des decorators nécessite `experimentalDecorators: true` dans tsconfig.json
- WebdriverIO utilise une approche légèrement différente pour les sélecteurs mais reste compatible

