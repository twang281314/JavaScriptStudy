var  Promise = require('bluebird');

Promise.delay(10000).then(function() {
    console.log("10000 ms passed");
    return "Hello world";
}).delay(500).then(function(helloWorldString) {
    console.log(helloWorldString);
    console.log("another 500 ms passed") ;
});
