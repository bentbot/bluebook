// Generated by CoffeeScript 1.10.0
var By, assert, chai, expect, port, selenium;

assert = require('assert');

chai = require('chai');

chai.use(require('chai-as-promised'));

selenium = require('selenium-webdriver');

By = selenium.By;

expect = chai.expect;

port = 3300;

before(function() {
  return this.driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();
});

after(function() {});

describe('WebDriver Autocomplete Test', function() {
  this.timeout(100000);
  return beforeEach(function() {
    return this.driver.get('http://localhost:8080');
  });
});