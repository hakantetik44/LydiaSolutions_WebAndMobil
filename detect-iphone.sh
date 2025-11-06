#!/bin/bash

echo "═══════════════════════════════════════════════════════════════"
echo "   📱 DÉTECTION DE L'IPHONE PHYSIQUE"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Vérifier si libimobiledevice est installé
if ! command -v idevice_id &> /dev/null; then
    echo -e "${YELLOW}⚠${NC}  libimobiledevice n'est pas installé"
    echo "   Installation en cours..."
    brew install libimobiledevice ideviceinstaller
fi

# Détecter l'iPhone
echo "Recherche d'appareils iOS connectés..."
UDID=$(idevice_id -l 2>/dev/null | head -n 1)

if [ -z "$UDID" ]; then
    echo -e "${RED}✗${NC} Aucun iPhone détecté via USB"
    echo ""
    echo "Assurez-vous que:"
    echo "  1. Votre iPhone est connecté via USB"
    echo "  2. Votre iPhone est déverrouillé"
    echo "  3. Vous avez fait confiance à cet ordinateur"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓${NC} iPhone détecté!"
echo "   UDID: $UDID"
echo ""

# Obtenir le nom de l'appareil
DEVICE_NAME=$(ideviceinfo -u $UDID -k DeviceName 2>/dev/null)
IOS_VERSION=$(ideviceinfo -u $UDID -k ProductVersion 2>/dev/null)

echo "Informations de l'appareil:"
echo "   Nom: $DEVICE_NAME"
echo "   Version iOS: $IOS_VERSION"
echo ""

# Lister les applications installées
echo "Recherche de l'application Lydia..."
APPS=$(ideviceinstaller -u $UDID -l 2>/dev/null | grep -i lydia)

if [ -z "$APPS" ]; then
    echo -e "${RED}✗${NC} Application Lydia non trouvée sur l'iPhone"
    echo ""
    echo "Applications disponibles contenant 'app':"
    ideviceinstaller -u $UDID -l 2>/dev/null | grep -i "app" | head -10
    echo ""
    echo "Veuillez installer l'application Lydia sur votre iPhone"
    exit 1
fi

echo -e "${GREEN}✓${NC} Application(s) Lydia trouvée(s):"
echo "$APPS"
echo ""

# Extraire le Bundle ID
BUNDLE_ID=$(echo "$APPS" | head -1 | awk -F',' '{print $1}' | xargs)

echo "Bundle ID détecté: $BUNDLE_ID"
echo ""

# Mettre à jour la configuration
CONFIG_FILE="src/test/resources/configuration.properties"

echo "Mise à jour de $CONFIG_FILE..."

# Créer une sauvegarde
cp $CONFIG_FILE ${CONFIG_FILE}.backup

# Mettre à jour l'UDID
sed -i '' "s/ios.udid=.*/ios.udid=$UDID/" $CONFIG_FILE

# Mettre à jour le Bundle ID
sed -i '' "s/ios.bundle.id=.*/ios.bundle.id=$BUNDLE_ID/" $CONFIG_FILE

# Mettre à jour le nom de l'appareil
if [ ! -z "$DEVICE_NAME" ]; then
    sed -i '' "s/ios.device.name=.*/ios.device.name=$DEVICE_NAME/" $CONFIG_FILE
fi

# Mettre à jour la version iOS
if [ ! -z "$IOS_VERSION" ]; then
    sed -i '' "s/ios.platform.version=.*/ios.platform.version=$IOS_VERSION/" $CONFIG_FILE
fi

echo -e "${GREEN}✓${NC} Configuration mise à jour!"
echo ""
echo "Configuration actuelle:"
grep "^ios\." $CONFIG_FILE
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Prêt à lancer les tests!${NC}"
echo ""
echo "Lancez les tests avec:"
echo "   platformName=ios npm test"
echo "═══════════════════════════════════════════════════════════════"

