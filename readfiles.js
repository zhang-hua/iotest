var fs = require('fs'),
    path = require('path');

var args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`Input files?`);
}

var promises = args.map(_path => {
    return new Promise(function(_path, resolve, reject){
        fs.readFile(_path, null, function(err, data){
            if (err){
               console.log(err);
               resolve("");    //following the same code flow
            } else {
                console.log(`${_path} has been loaded, size = ${data.length}`);
                resolve(data);
            }
        });
    }.bind(this, _path));
});

var startTime = new Date();
Promise.all(promises)
    .then(results => {
        console.log(`get results ${results.length}`);
        var newBuffer = Buffer.concat(results);
        var endTime = new Date();
        console.log(`merge results into buffer ${newBuffer.length}, time cost: ${endTime - startTime}ms, speed: ${Math.floor(newBuffer.length/ 1024/1024/(endTime - startTime)*1000)} MB/s`);
    })