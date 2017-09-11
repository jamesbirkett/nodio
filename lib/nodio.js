var pkg = require('../package.json');

// Instantiate with a credentials object that is persistant
function Nodio (credentials) {

	var api = require('./api');

	api.register(credentials);

	/**
	 * The nodio object to be returned from the module
	 *
	 * @type    object
	 */
	var nodio = {
			VERSION: pkg.version,
			items: require('./items'),
			tasks: require('./tasks')
		};

	return nodio;
}


/**
 * Handle Nodio being instantiated in the old way.
 *
 */
Nodio.addNewItem = function () {
	console.log('Nodio must be instantiated with credentials in the form: require("nodio")(credentials);');
};
Nodio.getItem = function () {
	console.log('Nodio must be instantiated with credentials in the form: require("nodio")(credentials);');
};

// Finally, export `Nodio` to the world.
module.exports = Nodio;