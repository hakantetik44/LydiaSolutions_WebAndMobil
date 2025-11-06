#!/bin/bash

echo "═══════════════════════════════════════════════════════════════"
echo "   🧪 VÉRIFICATION DE L'ENVIRONNEMENT DE TEST"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Vérifier Node.js
echo -n "Vérification de Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Installé ($NODE_VERSION)"
else
    echo -e "${RED}✗${NC} Non installé"
    ERRORS=$((ERRORS + 1))
fi

# 2. Vérifier npm
echo -n "Vérification de npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} Installé ($NPM_VERSION)"
else
    echo -e "${RED}✗${NC} Non installé"
    ERRORS=$((ERRORS + 1))
fi

# 3. Vérifier Appium
echo -n "Vérification d'Appium... "
if command -v appium &> /dev/null; then
    APPIUM_VERSION=$(appium --version 2>/dev/null || echo "inconnu")
    echo -e "${GREEN}✓${NC} Installé ($APPIUM_VERSION)"

    # Vérifier si Appium est en cours d'exécution
    echo -n "Vérification du serveur Appium... "
    if curl -s http://127.0.0.1:4723/status > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} En cours d'exécution"
    else
        echo -e "${YELLOW}⚠${NC}  Non démarré"
        echo "  → Démarrez Appium avec: appium"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} Non installé"
    echo "  → Installez Appium avec: npm install -g appium"
    ERRORS=$((ERRORS + 1))
fi

# 4. Vérifier ADB (Android Debug Bridge)
echo -n "Vérification d'ADB... "
if command -v adb &> /dev/null; then
    ADB_VERSION=$(adb version | head -n 1 | awk '{print $5}')
    echo -e "${GREEN}✓${NC} Installé ($ADB_VERSION)"

    # Vérifier les appareils Android
    echo -n "Vérification des appareils Android... "
    DEVICES=$(adb devices | grep -v "List" | grep -v "^$" | wc -l | tr -d ' ')
    if [ "$DEVICES" -gt 0 ]; then
        echo -e "${GREEN}✓${NC} $DEVICES appareil(s) détecté(s)"
        adb devices | grep -v "List" | grep -v "^$"
    else
        echo -e "${YELLOW}⚠${NC}  Aucun appareil détecté"
        echo "  → Démarrez un émulateur ou connectez un appareil"
    fi
else
    echo -e "${RED}✗${NC} Non installé"
    echo "  → Installez Android SDK Platform Tools"
    ERRORS=$((ERRORS + 1))
fi

# 5. Vérifier les dépendances npm
echo -n "Vérification des dépendances npm... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installées"
else
    echo -e "${YELLOW}⚠${NC}  Non installées"
    echo "  → Exécutez: npm install"
    ERRORS=$((ERRORS + 1))
fi

# 6. Vérifier la compilation TypeScript
echo -n "Vérification de la compilation TypeScript... "
if npx tsc --noEmit 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Aucune erreur"
else
    echo -e "${RED}✗${NC} Erreurs de compilation"
    echo "  → Exécutez: npx tsc --noEmit pour voir les erreurs"
    ERRORS=$((ERRORS + 1))
fi

# 7. Vérifier la configuration
echo -n "Vérification du fichier de configuration... "
if [ -f "src/test/resources/configuration.properties" ]; then
    echo -e "${GREEN}✓${NC} Trouvé"
else
    echo -e "${RED}✗${NC} Non trouvé"
    ERRORS=$((ERRORS + 1))
fi

# 8. Vérifier les fichiers feature
echo -n "Vérification des fichiers feature... "
FEATURE_COUNT=$(find src/test/resources/features -name "*.feature" 2>/dev/null | wc -l | tr -d ' ')
if [ "$FEATURE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} $FEATURE_COUNT fichier(s) trouvé(s)"
else
    echo -e "${RED}✗${NC} Aucun fichier feature trouvé"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Environnement prêt pour les tests!${NC}"
    echo ""
    echo "Pour lancer les tests:"
    echo "  platformName=android npm test"
    exit 0
else
    echo -e "${RED}❌ $ERRORS problème(s) détecté(s)${NC}"
    echo ""
    echo "Veuillez résoudre les problèmes ci-dessus avant de lancer les tests."
    exit 1
fi

