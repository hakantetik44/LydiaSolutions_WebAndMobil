# Guide de Démarrage Rapide - Version TypeScript

## 🚀 Installation Rapide

### 1. Prérequis
```bash
# Vérifier Node.js (version 18+)
node --version

# Vérifier npm
npm --version

# Appium doit être installé et démarré
appium --version
```

### 2. Installer les Dépendances
```bash
cd /Users/macbook/IdeaProjects/LydiaMobile_E2E
npm install
```

### 3. Compiler le Projet
```bash
npm run build
```

---

## 🧪 Exécuter les Tests

### Option 1: Utiliser le script
```bash
# Android
./run_tests_typescript.sh android

# iOS
./run_tests_typescript.sh ios
```

### Option 2: Utiliser npm directement
```bash
# Android
npm run test:android

# iOS
npm run test:ios
```

### Option 3: Avec paramètres personnalisés
```bash
platformName=android npm test
```

---

## 📁 Structure du Projet TypeScript

```
src/test/typescript/
├── pages/                    # Page Object Models
│   ├── BasePage.ts          # Classe de base pour toutes les pages
│   └── LydiaLoginPage.ts    # Page de connexion Lydia
│
├── stepDefinitions/          # Cucumber Step Definitions
│   ├── Hooks.ts             # Before/After hooks
│   └── LydiaLoginSteps.ts   # Steps pour login
│
├── utils/                    # Classes utilitaires
│   ├── ConfigReader.ts      # Lecture de configuration
│   ├── Driver.ts            # Gestion du WebDriver
│   └── OS.ts                # Détection de plateforme
│
├── runners/                  # Configuration
│   └── cucumber.config.ts   # Config Cucumber
│
└── index.ts                 # Exports centralisés
```

---

## 🔧 Configuration

Le fichier `src/test/resources/configuration.properties` est utilisé pour la configuration:

```properties
# Android
android.platform.name=Android
android.device.name=emulator-5554
android.app.package=com.lydia.lydia_app
android.app.activity=com.lydia.lydia_app.MainActivity

# iOS
ios.platform.name=iOS
ios.device.name=iPhone 15
ios.bundle.id=com.lydia.lydia-app

# Appium
appium.server.url=http://127.0.0.1:4723
```

---

## 📝 Créer un Nouveau Test

### 1. Créer une nouvelle Page
```typescript
// src/test/typescript/pages/MonNouvellePage.ts
import { BasePage } from './BasePage';

export class MonNouvellePage extends BasePage {
    // Localisateurs
    public getMonElement(): string {
        return OS.isAndroid() 
            ? '//android.widget.Button[@text="Mon Bouton"]'
            : '~MonBouton';
    }

    // Actions
    public async clickMonElement(): Promise<void> {
        await this.clickWithLog(this.getMonElement(), "Mon Element");
    }
}
```

### 2. Créer les Step Definitions
```typescript
// src/test/typescript/stepDefinitions/MesSteps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { MonNouvellePage } from '../pages/MonNouvellePage';

let maPage: MonNouvellePage;

Given('ma condition initiale', async function() {
    maPage = new MonNouvellePage();
    await maPage.init();
});

When('je clique sur mon élément', async function() {
    await maPage.clickMonElement();
});
```

### 3. Créer le Feature File
```gherkin
# src/test/resources/features/mon-test.feature
@android @ios
Feature: Mon Nouveau Test

  Scenario: Test de mon élément
    Given ma condition initiale
    When je clique sur mon élément
    Then le résultat est visible
```

---

## 🐛 Débogage

### Voir les logs détaillés
```bash
DEBUG=* npm test
```

### Compiler et voir les erreurs
```bash
npm run build
```

### Exécuter un seul scénario
Modifier `cucumber.js`:
```javascript
export default {
  // ...
  tags: '@monTag'
};
```

---

## 📊 Rapports

Les rapports sont générés dans:
- `target/cucumber.json` - Rapport JSON brut
- `target/cucumber-reports/cucumber-reports.html` - Rapport HTML visuel
- `target/cucumber-reports/CucumberTestReport.json` - Rapport JSON détaillé

---

## 🔍 Vérification des Erreurs

### TypeScript Compilation Errors
```bash
npx tsc --noEmit
```

### Linting (si configuré)
```bash
npm run lint
```

---

## 💡 Conseils

### 1. Utiliser async/await partout
```typescript
// ✅ BON
public async clickButton(): Promise<void> {
    await this.click(this.getButton());
}

// ❌ MAUVAIS
public clickButton(): void {
    this.click(this.getButton()); // Oubli de await
}
```

### 2. Toujours initialiser le driver
```typescript
// Dans les step definitions
const loginPage = new LydiaLoginPage();
await loginPage.init(); // Important!
```

### 3. Gérer les erreurs
```typescript
try {
    await this.click(selector);
} catch (error) {
    console.error('Erreur:', error);
    throw error; // Re-throw pour Cucumber
}
```

---

## 🆘 Problèmes Courants

### "Cannot find module"
```bash
npm install
npm run build
```

### "platformName is not defined"
```bash
# Toujours spécifier la plateforme
platformName=android npm test
```

### "Driver not initialized"
```bash
# Vérifier qu'Appium est démarré
appium

# Dans un autre terminal
npm test
```

### Erreurs de compilation TypeScript
```bash
# Nettoyer et rebuilder
npm run clean
npm run build
```

---

## 📚 Documentation

- [WebdriverIO](https://webdriver.io/)
- [Cucumber.js](https://github.com/cucumber/cucumber-js)
- [TypeScript](https://www.typescriptlang.org/)
- [Appium](https://appium.io/)

---

## ✅ Checklist Avant d'Exécuter

- [ ] Appium est installé et démarré
- [ ] Device/Emulator Android ou Simulator iOS est démarré
- [ ] Node.js version 18+ est installé
- [ ] Les dépendances npm sont installées (`npm install`)
- [ ] Le projet est compilé (`npm run build`)
- [ ] Le fichier `configuration.properties` est configuré correctement

---

## 🎯 Prochaines Étapes

1. Installer les dépendances: `npm install`
2. Démarrer Appium: `appium`
3. Compiler: `npm run build`
4. Lancer les tests: `npm run test:android`
5. Consulter les rapports dans `target/cucumber-reports/`

Bon test! 🚀

