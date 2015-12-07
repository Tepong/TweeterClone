var passport = require('../node_modules/passport');
var mongoose = require('../node_modules/mongoose');

module.exports = function(){
	var User = mongoose.model('User');

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findOne({_id: id},'-password -salt', function(err,user){
			done(err, user);
		});	
	});
	require('./strategies/local.js')();
};