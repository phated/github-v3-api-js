var connect = require('connect')
  , auth    = require('connect-auth')
  , path    = require('path')
  , url     = require('url')
  , fs      = require('fs');

var OAuth = require('oauth').OAuth;

// N.B. TO USE Any of the OAuth or RPX strategies you will need to provide
// a copy of the example_keys_file (named keys_file) 
try {
  var keys = require('./keys_file');
  for(var key in keys) {
    global[key]= keys[key];
  }
} catch(e) {
  console.log('Unable to locate the keys_file.js file.  Please copy and ammend the example_keys_file.js as appropriate');
  return;
}

// This middleware detects login requests (in this case requests with a query param of ?login_with=xxx where xxx is a known strategy)
var github_auth = function() {
  return function(req, res, next) {
    var urlp= url.parse(req.url, true)
    if( urlp.query.login_with == 'github' ) {
      req.authenticate('github', function(error, authenticated) {
        if( error ) {
          // Something has gone awry, behave as you wish.
          console.log( error );
          res.end();
        } else {
          if( authenticated === undefined ) {
            // The authentication strategy requires some more browser interaction, suggest you do nothing here!
          }
          else {
            // We've either failed to authenticate, or succeeded (req.isAuthenticated() will confirm, as will the value of the received argument)
            next();
          }
        }
      });
    } else {
      next();
    }
  }
};
  
function routes(app) {
  app.get ('/logout', function(req, res, params) {
    req.logout(); // Using the 'event' model to do a redirect on logout.
  })

  app.get(/.*/, function(req, res, params) {
    var oneMonthFromToday = new Date(Date.now() + 2629743830).toUTCString();
    var filepath = ''
      , headers  = {};
    if(req.isAuthenticated()) {
      filepath = 'index-auth.html';
      headers  = {
        'Content-Type': 'text/html',
        'Set-Cookie'  : ['ghtoken=' + req.session.access_token + '; Expires=' + oneMonthFromToday]
      }
    } else {
      filepath = 'index-noauth.html';
      headers  = {
        'Content-Type': 'text/html'
      }
    }
    path.exists(filepath, function(exists) {
      if(exists) {
        fs.readFile(filepath, function(error, content) {
          if(error) {
            res.writeHead(500);
            res.end();
          } else {
            res.writeHead(200, headers);
            res.end(content, 'utf-8');
          }
        });
      } else {
        res.writeHead(404);
        res.end(filePath);
      }
    });
  })
}

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.stack);
});

connect.createServer()
  .use(connect.static(__dirname + '/public'))
  .use(connect.cookieParser()) 
  .use(connect.session({
    secret: connectSecret, 
    store: new connect.session.MemoryStore({ reapInterval: -1 })
  }))
  .use(auth({
    strategies:[ auth.Github({appId : ghId, appSecret: ghSecret, callback: ghCallbackAddress}) ],
    trace: true
  }))
  .use(github_auth())
  .use(connect.router(routes))
  .listen(9999);