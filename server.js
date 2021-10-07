var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs');

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', (req, res) => {
  console.log("woho")
  res.sendFile(__dirname + '/index.html')
})

app.get('/en', (req, res) => {
  res.sendFile(__dirname + '/index_en.html')
})

app.post('/feedback', (req, res) => {
  var timestamp = new Date().getTime();
  req.body.timestamp = timestamp;
  console.log(req.body)
  fs.writeFile(path.join(__dirname, 'feedback')+'/'+timestamp+'.json', JSON.stringify(req.body), function (err) {
    if (err) return console.log(err);
    if(req.body.lang == "nl") {
      res.redirect('/bedankt')
    } else {
      res.redirect('/thanks')
    }
  });
})

app.get('/bedankt', (req, res) => {
  res.sendFile(__dirname + '/bedankt.html')
})

app.get('/thanks', (req, res) => {
  res.sendFile(__dirname + '/thanks.html')
})

app.listen(3000, function() {
  console.log('listening on 3000')
  console.log("woho")
})
