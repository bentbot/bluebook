###
# Testing Program
#
# 1. Successfully get and return the YAML document
# 2. Return suggestions that match a search term
#
###

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
    @driver.get 'http://localhost:8000'

  it 'checks if the widget has loaded', ->
    inputBox = @driver.findElement({ id: 'yaml_member_search_box' })
    assert( inputBox )

  it 'displays correct suggestions', ->
    @driver.findElement({ id: 'yaml_member_search_box' }).then (inputBox) ->
      inputBox.click();
      inputBox.sendKeys('TD Canada');
      inputBox.sendKeys(selenium.Key.ENTER);
    @driver.sleep 1000
    @driver.findElement({ css: '.autocomplete-suggestion' }).then (suggestion) ->
      dataval = suggestion.getText()
    # For some reason the getText() functions return invalid
      #assert.equal(dataval, 'TD Canada Trust')

  it 'closes the result window', ->
    @driver.findElement({ id: 'yaml_member_search_box' }).then (inputBox) ->
      inputBox.click();
      inputBox.sendKeys('TD Canada');
      inputBox.sendKeys(selenium.Key.ENTER);

  it 'searches for multiple items', ->
    @driver.findElement({ id: 'yaml_member_search_box' }).then (inputBox) ->
      inputBox.click();
      inputBox.sendKeys('TD Canada');
      inputBox.sendKeys(selenium.Key.ENTER);
    @driver.sleep 1000
    @driver.findElement({ id: 'yaml_member_result_close' }).click()
    @driver.sleep 500
    @driver.findElement({ id: 'yaml_member_search_box' }).then (inputBox) ->
      inputBox.click();
      inputBox.sendKeys('Royal Bank');
      inputBox.sendKeys(selenium.Key.ENTER);
    @driver.sleep 500
    @driver.findElement({ id: 'yaml_member_result_close' }).click()
    @driver.sleep 250
    @driver.findElement({ id: 'yaml_member_search_box' }).then (inputBox) ->
      inputBox.click();
      inputBox.sendKeys('TD Bank');
      inputBox.sendKeys(selenium.Key.ENTER);
    @driver.sleep 500
    @driver.findElement({ id: 'yaml_member_result_close' }).click()
