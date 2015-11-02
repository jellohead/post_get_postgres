/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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


// original app.get routine
// app.get('/comments.json', function(req, res) {
//   fs.readFile('comments.json', function(err, data) {
//     res.setHeader('Cache-Control', 'no-cache');
//     res.json(JSON.parse(data));
//   });
// });

// app.get('/d', function(req, res) {
//   console.log('GET requested');
//   pg.connect(conString, function(err, client, done) {
//     //console.log(done);
//     var handleError = function(err) {
//       if(!err) return false;
//       if(client) {
//         done(client);
//       }
//       res.writeHead(500, {'content-type': 'text/plain'});
//       res.end('An error occurred');
//       return true;
//     };
//     var myQuery = function(){
//       client.query('SELECT name, comment FROM comments', function(err, result){
//         if(handleError(err)) return;
//     });
//     }


//     if(handleError(err)) return;
//     myQuery();
//     // client.query('SELECT name, comment FROM comments', function(err, result){
//     //   if(handleError(err)) return;
//       // console.log(result.rows);
//       //console.log('Result rows:');
//     });
//     console.log(function() {
//       myQuery();
//     });
//     done();
//     res.writeHead(200, {'content-type': 'text/plain'})
//     res.send(result.rows);
//     //res.end('Finished with this request');
//   })

// });


app.get('/d', function(req, res) {
  console.log('GET requested');
  pg.connect(conString, function(err, client, done) {

    var handleError = function(err) {
      //console.log('Error in the app.get handleError routine. err returns: ' + err);
      if(!err) {
        //console.log('if(!err) returns: ' + !err); //returning true here so no error so far
        return;
      }
      if(client) {
        console.log('if(client) returns: ' + client);
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
      //err
      if(handleError(err)) return;
      //result
      var json = JSON.stringify(result.rows, null, 1);
      console.log(json);
      res.send(json);
      //res.writeHead(200, {'content-type':'application/json', 'content-length':Buffer.byteLength(json)});
      //res.end(json);
      // return result.rows;
    });

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


  // original routine cut from the app.post function
  // fs.readFile('comments.json', function(err, data) {
  //   var comments = JSON.parse(data);
  //   comments.push(req.body);
  //   fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
  //     res.setHeader('Cache-Control', 'no-cache');
  //     res.json(comments);
  //   });
  // });

// SyntaxError: Unexpected token <(…)
// example.js:42 / parsererror SyntaxError: Unexpected token <(anonymous function) @ example.js:42j @ jquery.js:3073k.fireWith @ jquery.js:3185x @ jquery.js:8253(anonymous function) @ jquery.js:8598
// example.js:41 SyntaxError: Unexpected token <(…)

