var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var app = express();
var conString = "postgres://postgres:discos@localhost/postgres";

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/d', function(req, res) {
  console.log('GET requested');
  pg.connect(conString, function(err, client, done) {
    var handleError = function(err) {
      if(!err) {
        return;
      }
      if(client) {
        done(client);
      }
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred');
      return true;
    };
    //err
    if(handleError(err)) {
      console.log('in the handleError(err) routine');
      return;
    } 
    //client
    client.query('SELECT name, comment FROM comments', function(err, result){
      if(handleError(err)) return;
      var json = JSON.stringify(result.rows, null, 1);
      console.log(json);
      res.send(json);
    })
    //done
    done();  
  })
});

app.post('/', function(req, res) {
  console.log('POST requested');
  pg.connect(conString, function(err, client, done) {
    var handleError = function(err) {
      if(!err) return false;
      if(client){
        done(client);
      }
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred');
      return true;
    };
    if(handleError(err)) return;
    console.log(JSON.stringify(req.body.name) + ' ' + JSON.stringify(req.body.comment));
    client.query('INSERT INTO comments (name, comment) VALUES ($1, $2)', [JSON.stringify(req.body.name), JSON.stringify(req.body.comment)], function(err, result) {
      if(handleError(err)) return;
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

