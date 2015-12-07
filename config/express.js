var express = require('../node_modules/express');
var morgan = require('../node_modules/morgan');
var compression = require('../node_modules/compression');
var bodyParser = require('../node_modules/body-parser');
var sass = require('../node_modules/node-sass-middleware');
var validator = require('../node_modules/express-validator');
// var cookieSession = require('../node_modules/cookie-session');
var session = require('../node_modules/express-session');
var flash = require('../node_modules/connect-flash');
var passport = require('../node_modules/passport');
// var RedisStore = require('../node_modules/connect-redis')(session);
var config = require('./config');

module.exports = function(){
	var app = express();
	if(process.env.NODE_ENV ==='development'){
		app.use(morgan('dev'));
	}else{
		app.use(compression);
	}
	app.use(session({
		// store: new RedisStore({
		// 	host: 'localhost',
		// 	port: 6379,
		// 	db: 2,
		// 	pass: 'redis_password'
		// })
		secret : config.sessionSecret,
		resave : false,
		saveUninitialized : true
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	// app.use(cookieSession({
	// 	name : 'session',
	// 	keys : ['secret_key1','secret_key2']
	// }));
	app.use(bodyParser.urlencoded({
		extend: true
	}));
	app.use(bodyParser.json());
	app.use(validator());


	app.set('views', './app/views');
	app.set('view engine', 'jade');

	// var html_dir = './';

	// // routes to serve the static HTML files
	// app.get('/', function(req, res) {
	//     res.sendfile(html_dir + 'index.html');
	// });


	require('../app/routes/index.routes')(app);
	require('../app/routes/user.routes')(app);
	app.use(sass({
		src: './sass',
		dest: './public/css',
		outputStyle: 'compressed',
		prefix: '/css',
		debug: true,
		indentedSyntax: true
	}));
	app.use(express.static('./public'));
	return app;
};