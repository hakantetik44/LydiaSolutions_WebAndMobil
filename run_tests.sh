#!/bin/bash

# Nettoyer les anciens résultats
rm -rf target/allure-results
rm -rf target/allure-report

# Exécuter les tests avec Maven
mvn clean test -DplatformName=ios

# Générer le rapport Allure
allure generate target/allure-results -o target/allure-report --clean

# Ouvrir le rapport dans le navigateur
allure open target/allure-report
