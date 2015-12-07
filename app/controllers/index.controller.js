exports.render = function(req, res){
	res.render('index',{
		title: 'Hello World',
		username: req.user ? req.user.username : ''
	});
	// res.send('Hello World');
	// var isLoggedIn = false;
	// if(typeof req.session.remember !== 'underfined'){
	// 	isLoggedIn = req.session.remember;
	// }

	// res.render('index',{
	// 	'title' : 'Hello World',
	// 	'message' : 'How are things',
	// 	isLoggedIn : isLoggedIn
	// });
};