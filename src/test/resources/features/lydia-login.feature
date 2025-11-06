@android @ios
Feature: Lydia Login - Aide et Support
  En tant qu'utilisateur de l'application Lydia
  Je veux pouvoir accéder à l'aide
  Afin de résoudre mes problèmes de connexion

  @help @smoke
  Scenario: Demander de l'aide pour un problème de connexion
    Given l'application Lydia est lancée
    When l'utilisateur clique sur "Besoin d'aide"
    And l'utilisateur clique sur "Un problème pour vous connecter"
    And l'utilisateur saisit le numéro "0612345678"
    And l'utilisateur saisit l'email "test@exemple.fr"
    Then l'utilisateur envoie la demande d'aide

