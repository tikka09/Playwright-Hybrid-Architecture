Feature: Login

  Scenario: Successful login
    Given I open the login page
    When I login with "standard_user" and "secret_sauce"
    Then I should be logged in
    Then the user "standard_user" should exist in DB

  Scenario: Invalid credentials
    Given I open the login page
    When I login with "wrong" and "invalid"
    Then I should see an error message
