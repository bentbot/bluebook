var async = require('async');
var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
    until = webdriver.until;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
	chai.use(chaiAsPromised);
var expect = chai.expect;


var driver = new webdriver.Builder()
	.forBrowser('chrome')
	.usingServer('http://localhost:4444/wd/hub')
	.build();

var candidate = 1;
var numerations = 1;

// Begin the voting loop
for (var i = numerations - 1; i >= 0; i--) {

	// Load the front-end
	driver.get('http://localhost:8080');

	// Select a candidate 
	var candidates = driver.findElement(By.css('.candidates li:nth-child('+candidate+')')).click()

	// Submit the vote
	driver.findElement(By.id('submit')).click();

	// Load the statistics
	driver.get('http://localhost:8080/statistics');

};
