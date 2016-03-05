//Promise.all 

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var files=[];
for(var i=0;i<100;i++){
     files.push(fs.writeFileAsync('fils-'+i+'.txt','','utf-8'));
}

Promise.all(files).then(function(){
    console.log('all the files have created');
});