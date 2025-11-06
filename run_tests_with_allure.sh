#!/bin/bash

# Script pour lancer les tests et générer automatiquement le rapport Allure

echo "═══════════════════════════════════════════════════════════════"
echo "   🧪 LANCEMENT DES TESTS AVEC RAPPORT ALLURE"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Vérifier si la plateforme est spécifiée
if [ -z "$1" ]; then
    echo -e "${RED}❌ Erreur: Plateforme non spécifiée${NC}"
    echo "Usage: $0 [android|ios]"
    echo "Example: $0 ios"
    exit 1
fi

PLATFORM=$1

# Nettoyer les anciens résultats Allure
echo "🧹 Nettoyage des anciens résultats..."
rm -rf target/allure-results/*
rm -rf target/allure-report/*

# Lancer les tests
echo ""
echo "▶️  Lancement des tests $PLATFORM..."
echo ""

platformName=$PLATFORM npm run test:only

TEST_EXIT_CODE=$?

echo ""
echo "═══════════════════════════════════════════════════════════════"

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Tests terminés avec succès${NC}"
else
    echo -e "${YELLOW}⚠️  Tests terminés avec des échecs${NC}"
fi

echo "═══════════════════════════════════════════════════════════════"
echo ""

# Générer le rapport Allure
echo "📊 Génération du rapport Allure..."
npm run allure:generate

echo ""
echo "🌐 Ouverture du rapport Allure dans le navigateur..."
echo ""

# Ouvrir le rapport Allure
npm run allure:open &

echo ""
echo -e "${GREEN}✅ Rapport Allure généré et ouvert!${NC}"
echo ""
echo "Le rapport est disponible dans: target/allure-report/index.html"
echo ""

exit $TEST_EXIT_CODE

