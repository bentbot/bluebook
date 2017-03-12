assert = require 'assert'
chai = require 'chai'
chai.use require 'chai-as-promised'
selenium = require 'selenium-webdriver'
By = selenium.By
expect = chai.expect
port = 3300;

before ->
  @driver = new selenium.Builder()
    .withCapabilities(selenium.Capabilities.chrome())
    .build()

after ->
  #@driver.quit()

describe 'WebDriver Autocomplete Test', ->
  @timeout 100000
  beforeEach ->
    @driver.get 'http://localhost:8080'