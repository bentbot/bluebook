var assert = require('assert'),
	mocha = require('mocha'),
	webdriver = require('selenium-webdriver'),
	webdriverio = require('webdriverio'),
    By = webdriver.By,
    until = webdriver.until;

   var options = {
   	desiredCapabilities: {
   		browserName: 'chrome'
   	}
   };


 webdriverio
    .remote(options)
    .init()
    .url('http://www.google.com')
    .getTitle().then(function(title) {
        console.log('Title was: ' + title);
    })
    .end();
