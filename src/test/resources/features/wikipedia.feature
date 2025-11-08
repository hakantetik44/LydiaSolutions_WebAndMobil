@android @ios
Feature: Wikipedia Mobile App - Navigation and Search
  As a user of Wikipedia mobile application
  I want to navigate through carousel, search for content and change language settings

  @smoke
  Scenario: Complete user journey - Carousel, search, language change and navigation
    Given the app is launched
    When I swipe through the carousel until the last image
    And I search for "Lydia"
    And I scroll until I find the city "Lydia" and dismiss the popup
    And I change the website language to French
    And I scroll down to the bottom of the page
    Then I click on "Crésus" and navigate to the newly opened page





