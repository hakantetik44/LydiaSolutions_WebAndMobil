@api
Feature: ReqRes API Testing
  As a QA Engineer
  I want to test the ReqRes API endpoints
  So that I can verify the API functionality

  @smoke @create-user
  Scenario: Create a new user via POST endpoint
    Given I have a valid user data with name "Hakan" and job "QA Engineer"
    When I send a POST request to create a user
    Then the response status code should be 201
    And the response should contain the created user with name "Hakan" and job "QA Engineer"
    And the response time should be less than 5000 milliseconds

  @smoke @get-user
  Scenario: Fetch a user via GET endpoint
    Given I want to fetch user with ID 2
    When I send a GET request to fetch the user
    Then the response status code should be 200
    And the response should contain user data with id 2, email "janet.weaver@reqres.in", first_name "Janet", and last_name "Weaver"
    And the response time should be less than 3000 milliseconds


