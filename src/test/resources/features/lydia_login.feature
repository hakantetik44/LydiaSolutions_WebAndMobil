@lydia @accueil @ios
Feature: Assistance à la connexion de l'application Lydia
  En tant qu'utilisateur de Lydia
  Je veux accéder à l'aide à la connexion
  Afin de résoudre mes problèmes de connexion

  @besoin-aide @ios
  Scenario: Demande d'aide à la connexion
    Given l'application Lydia est lancée
    When l'utilisateur clique sur "Besoin d'aide"
    And l'utilisateur clique sur "Un problème pour vous connecter"
    And l'utilisateur saisit le numéro "0612345678"
    And l'utilisateur saisit l'email "test.lydia2024@gmail.com"
    Then l'utilisateur envoie la demande d'aide

 