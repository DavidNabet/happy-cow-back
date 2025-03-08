Feature: Test the HTTP Request from the data of data.json
    Scenario: Get a category on querystring
        Given I make a GET request to "http://localhost:3200/restaurants/data"
        When The query key is type and the value is vegan
        Then I should receive a "response"
