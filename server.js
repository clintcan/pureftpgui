const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const config = require('./config');
const port = config.port;

/*** Setting the Engine ***/
const mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

/*** Use Body Parser ***/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*** Use Cookie Session ***/
app.use(cookieSession({
  name: 'session',
  keys: config.keys,

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

/*** Controller Section ***/
const api = require('./controllers/api_controller');
const home = require('./controllers/home');

app.use('/api', api);
app.use('/', home);

/*** Static routes ***/
// app.use('/public', express.static('public')); // for public routes with /public folder
app.use(express.static('public')); 

app.use(function (req, res, next) {
  res.status(404).render("404")
})

app.listen(port,() => console.log(`PureFTP-GUI running at http://localhost:${port}`));