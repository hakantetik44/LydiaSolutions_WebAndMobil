# Lydia Mobile E2E Tests - TypeScript Version
## Description
Ce projet contient les tests E2E pour l'application mobile Lydia, convertis de Java vers TypeScript.
## Structure du Projet
```
src/test/typescript/
├── pages/              # Page Object Models
│   ├── BasePage.ts
│   └── LydiaLoginPage.ts
├── stepDefinitions/    # Step Definitions Cucumber
│   ├── Hooks.ts
│   └── LydiaLoginSteps.ts
├── utils/              # Classes utilitaires
│   ├── ConfigReader.ts
│   ├── Driver.ts
│   └── OS.ts
└── runners/            # Configuration du runner
    └── cucumber.config.ts
```
## Installation
### Prérequis
- Node.js (version 18+)
- npm ou yarn
- Appium Server
- Android SDK (pour les tests Android)
- Xcode (pour les tests iOS)
### Installation des dépendances
```bash
npm install
```
## Configuration
Le fichier de configuration `src/test/resources/co# Lydia Mobile E2E Tests - TypeScript Version
## Description
Ce projet contienut## Description
Ce projet contient les tests m Ce projet con
### Structure du Projet
```
src/test/typescript/
├── pages/              # Page Object Models
st```
src/test/typescricusrr ├── pages/   sh│   ├── BasePage.ts
│   └── Lydiars│   └── LydiaLoginmN├── stepDefinitions/    # or│   ├── Hooks.ts
│   └── LydiaLoginSteps/c│   └── LydiaLo J├── utils/              # C- │   ├── ConfigReader.ts
│   ├── Drcr│   ├── Driver.ts
│ on│   └── OS.ts
?n└── runners/  e.    └── cucumber.config.ts
```
## Installation
#at```
## Installation
### Préreqra## d### Prérequis C- Node.js (veui- npm ou yarn
- Appiumse- Appium Ser?t- Android SDK en- Xcode (pour les tests iOS)
### Instiv### Installation des dépenpe```bash
npm install
```
## Confiénpm ins ```
## Cons
##MoLe fichier de cco## Description
Ce projet contienut## Description
Ce projet contient les tests m Ce projet con
t Ce projet con?qCe projet contient les tests m C d### Structure du Projet
```
src/test/typescar```
src/test/typescripcrsr s├── pages/    pst```
src/test/typescricuscat > /Users/macbook/IdeaProjects/LydiaMobile_E2E/run_tests_typescript.sh << 'EOF'
#!/bin/bash
# Script pour exécuter les tests TypeScript
# Usage: ./run_tests_typescript.sh [android|ios]
PLATFORM=${1:-android}
echo "🚀 Démarrage des tests E2E TypeScript"
echo "📱 Plateforme: $PLATFORM"
# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer."
    exit 1
fi
# Vérifier que les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi
# Build le projet
echo "🔨 Compilation du projet TypeScript..."
npm run build
# Exécuter les tests
echo "🧪 Exécution des tests..."
platformName=$PLATFORM npm test
echo "✅ Tests terminés!"
