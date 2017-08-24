var express = require('express'),
    exphbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    TwitterStrategy = require('passport-twitter'),
    GoogleStrategy = require('passport-google'),
    FacebookStrategy = require('passport-facebook');

var app = express();

//===============PASSPORT===============



//===============EXPRESS================
// Configure Express
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next) {
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if(err) {res.locals.error = err;}
  if(msg) {res.locals.notice = msg;}
  if(success) {res.locals.success = success;}

  next();
});

// Configure express to use handlebars templates
// Create an instance:
var hbs = exphbs.create({
    defaultLayout: 'main',
});

// Register `hbs.engine` with the Express app:
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// app.engine('.hbs', exphbs({extname: '.hbs'}));
// app.set('view engine', '.hbs');

//===============ROUTES===============

//displays our homepage
app.get('/', function(req, res) {
  res.render('home', {user: req.user});
});

//displays our signup page
app.get('/signin', function(req, res) {
  res.render('signin');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns user to signin page
app.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns user to signin page
app.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res) {
  var name = req.user.username;
  console.log("LOGGING OUT " + req.user.username);
  req.logout();
  res.redirect('/');
  req.session.notice = name + "has successfully been logged out!";
});

//===============PORT=================
var port = process.env.PORT || 5000; //select your port or let it pull from your .env file
app.listen(port);
console.log("listening on port " + port + "...");
