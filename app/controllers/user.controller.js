// var User = require('../../config/mongoose').model('User');
// var User = require('../models/user.model').model('User');
var User = require('../../node_modules/mongoose').model('User');
var passport = require('../../config/passport');

var getErrorMessage = function(err){
	var message = '';
	if(err.code){
		switch(err.code){
			case 11000:
			case 11001:
				message = 'User already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	}else{
		for(var errName in err.errors){
			if (err.errors[errName].message){
				message = err.errors[errName].message;
			}
		}
	}
	return message;
};


exports.login = function(req, res){
	if(req.body.remember === 'remember'){
		req.session.remember = true;
		req.session.email = req.body.email;
		// req.session.cookie.maxAge = 60000;
	}
	console.log(req.body);
	console.log('Email: ' + req.body.email);
	console.log('Password: ' + req.body.password);

	res.render('index',{
		title : 'Logged in as' + req.body.email,
		isLoggedIn: true
	});
};

exports.logout = function(req, res){
	req.session = null;
	res.render('index',{
		title : 'See you agin later',
		isLoggedIn: false
	});
};

exports.create = function(req, res, next){
	var user = new User(req.body);
	user.save(function(err){
		if(err){
			return next(err);
		}else{
			res.json(user);
		}
	});
};

exports.list = function(req, res, next){
	User.find({},function(err,users){
		if(err){
			return next(err);
		}else{
			res.json(users);
		}
	});	
};

exports.delete = function(req, res, next){
	req.user.remove(function(err){
		if(err){
			return next(err);
		}else{
			req.user = user;
		}
	});
};

exports.update = function(req, res){
	User.findOneAndUpdate({username: req.user.username}, req.body,
		function(err, users){
			if(err){
				return next(err);
			}else{
				req.user = user;
			}
	});
};

exports.read = function(req, res){
	res.json(req.user);
};

exports.userByUsername = function(req,res, next, username){
	User.findOne({
		username: username
		},function(err,user){
			if(err){
				return next(err);
			}else{
				req.user = user;
				next();
			}
	});
};

exports.renderSignup = function(req, res){
	res.render('signup',{
		title: 'Sign up',
		messages: req.flash('error')
	});
};

exports.signup = function(req, res, next){
	if(!req.user){
		var user = new User(req.body);
		user.provider = 'local';
		user.save(function(err){
			if(err){ 
				var message = getErrorMessage(err);
				req.flash('error', message);
				return res.redirect('/signup');
			}		
			req.login(user, function(err){
				if(err)return next(err);
				return res.redirect('/');
			});
		});
		
	}else{
		return res.redirect('/');
	}
};