var fs = require('fs');
const converter = require('json-2-csv');

// make Promise version of fs.readdir()
fs.readdirAsync = function(dirname) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dirname, function(err, filenames){
            if (err)
                reject(err);
            else
                resolve(filenames);
        });
    });
};

// make Promise version of fs.readFile()
fs.readFileAsync = function(filename, enc) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, enc, function(err, data){
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};

// utility function, return Promise
function getFile(filename) {
    return fs.readFileAsync('./feedback/' + filename, 'utf8');
}

fs.writeFile('./public/summary.json', '', function(){console.log('done')});


// read all json files in the directory, filter out those needed to process, and using Promise.all to time when all async readFiles has completed.
fs.readdirAsync('./feedback').then(function (filenames){
    console.log(filenames);
    return Promise.all(filenames.map(getFile));
}).then(function (files){
    var summaryFiles = [];
    files.forEach(function(file) {
      var json_file = JSON.parse(file);
      summaryFiles.push(json_file);
    });
    fs.appendFile("./public/summary.json", JSON.stringify(summaryFiles, null, 4), function(err) {
        if(err) {
          return console.log(err);
        }
        console.log("The file was appended!");
    });
    // convert JSON array to CSV string
    converter.json2csv(summaryFiles, (err, csv) => {
        if (err) {
            throw err;
        }

        // print CSV string
        fs.writeFileSync('./public/summary.csv', csv);
    });
});
