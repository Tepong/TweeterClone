// var mongoose = require('../../config/mongoose');
var  mongoose = require('../../node_modules/mongoose');
var crypto = require('crypto')
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	firstname: String,
	lastname: String,
	username: {
		type:String
	},
	email: {
		type:String,
		index: true,
		match: /.+\@.+\.+.*/
	},
	password: {
		type : String,
		validate:[
			function(password){
				return password && password.length >= 6;
			},
			'Password must be at least 6 characters'
		]
	},
	salt:{
		type: String
	},
	provider:{
		type: String
	},
	providerId: String, 
	providerData:{}, 
	create: {
		type: Date,
		default: Date.now 
	},
	role:{
		type: String,
		enum:['Admin', 'Owner', 'User']
	}
});

// UserSchema.method.hashPassword = function(password){
// 	console.log(this.salt);
// 	return crypto.pbkdf2Sync(password, this.salt, 10000,64).toString('base64');
// };



UserSchema.methods.hashPassword = function(password){
	console.log(this);
	return crypto.pbkdf2Sync(password, this.salt, 10000,64).toString('base64');
};

UserSchema.methods.authenticate = function(password){
	return this.password === this.hashPassword(password);
};

UserSchema.pre('save', function(next){
	if(this.password){
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'),'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

mongoose.model('User', UserSchema);
