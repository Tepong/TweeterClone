// var mongoose = require('../../config/mongoose');
var  mongoose = require('../../node_modules/mongoose');
var Schema = mongoose.Schema;
var PostSchema = new Schema({
	title:{
		type: String,
		require: true
	},
	content:{
		type: String,
		require: true
	},
	author:{
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Post', PostSchema);