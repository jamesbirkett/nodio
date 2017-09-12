var pkg = require('../package.json');
var Api = require('./api');
var Items = require('./items');
var Tasks = require('./tasks');

// Instantiate with a credentials object that is persistant
function Nodio (credentials) {
	var api = new Api(credentials);

	/**
	 * The nodio object to be returned from the module
	 *
	 * @type    object
	 */
	this.VERSION = pkg.version;
	this.items = new Items({api: api});
	this.tasks = new Tasks({api: api});


	/**
	 * Placeholder functions to allow for backwards compatability with the old methods
	 */
	this.addNewItem = function () {
		console.info('This method has been replaced with "nodio.items.create()" and will be deprecated in the next version');
		this.items.create.apply(this.items, arguments);
	};
	this.getItem = function () {
		console.info('This method has been replaced with "nodio.items.get()" and will be deprecated in the next version');
		this.items.get.apply(this.items, arguments);
	};
	this.filterItems = function () {
		console.info('This method has been replaced with "nodio.items.filter()" and will be deprecated in the next version');
		this.items.filter.apply(this.items, arguments);
	};
	this.getCommentsOnItem = function () {
		console.info('This method has been replaced with "nodio.items.getComments()" and will be deprecated in the next version');
		this.items.getComments.apply(this.items, arguments);
	};
	this.addCommentToItem = function () {
		console.info('This method has been replaced with "nodio.items.addComment()" and will be deprecated in the next version');
		this.items.addComment.apply(this.items, arguments);
	};
}


/**
 * Handle Nodio being instantiated in the old way.
 *
 */
Nodio.addNewItem = function () {
	console.log('Nodio must be instantiated with credentials in the form: var Nodio = require("nodio"); var instanceOfNodio = new Nodio(credentials);');
};
Nodio.getItem = function () {
	console.log('Nodio must be instantiated with credentials in the form: var Nodio = require("nodio"); var instanceOfNodio = new Nodio(credentials);');
};

// Finally, export `Nodio` to the world.
module.exports = Nodio;