
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({
	extended: true
})); 

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://beepidb:Test!ng123@ds031832.mongolab.com:31832/beepidb'); // connect to our database
var Bear     = require('./app/models/bear');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// MIDDLEWARE FOR ALL REQUESTS
// =============================================================================
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// on routes that end in /bears
// ----------------------------------------------------
var bearRoutes = router.route('/bears'); 

// create a bear (accessed at POST http://localhost:8080/bears)
bearRoutes.post(function(req, res) {	
	var bear = new Bear();		// create a new instance of the Bear model
	bear.name = req.body.name;  // set the bears name (comes from the request)
	bear.save(function(err) {
		if (err) res.send(err);
		res.json({ message: 'Bear created!', data: bear });
	});
}); 

// get all the bears (accessed at GET http://localhost:8080/api/bears)
bearRoutes.get(function(req, res) {
	Bear.find(function(err, bears) {
		if (err)
			res.send(err);

		res.json(bears);
	});
});

bearRoutes.delete(function(req, res) {
	Bear.findByIdAndRemove(req.params.bear_id, function(err) {
		if (err) res.send(err); 
		res.json({message: "Bear removed Successfully"}); 
	});
}); 

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

	// get the bear with that id
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
		});
	})

	// update the bear with this id
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {

			if (err)
				res.send(err);

			bear.name = req.body.name;
			bear.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});

		});
	})

	// delete the bear with this id
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
