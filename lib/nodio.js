var rest = require('restler');
var moment = require('moment');
var _ = require('lodash');

// Instantiate with a credentials object that is persistant
function Nodio (credentials) {

	/**
	 * The nodio object to be returned from the module
	 *
	 * @type    object
	 */
	var nodio = {
		VERSION: '3.5.0'
	};

	if (!_.has(credentials, 'app_id')) {
		throw new Error('You must specify an app_id');
	}
	if (!_.has(credentials, 'app_token')) {
		throw new Error('You must specify an app_token');
	}
	if (!_.has(credentials, 'client_id')) {
		throw new Error('You must specify a client_id');
	}
	if (!_.has(credentials, 'client_secret')) {
		throw new Error('You must specify a client_secret');
	}

	/**
	 * Token that Podio returns to allow the interacting with an app
	 *
	 * @type    object
	 */
	var access_token;

	/**
	 * Number of milliseconds in which the access token expires
	 *
	 * @type    integer
	 */
	var expires_in;

	/**
	 * The time the the access token was authenticated
	 *
	 * @type    object
	 */
	var authentication_time;


	/**
	 * Validates the provided credentials against Podio's OAUTH api
	 *
	 * @param   function    callback        Run on completion
	 *
	 * @return  void
	 */
	function validateCredentials (callback) {
		//We're using the app authentication flow
		credentials.grant_type = "app";


		if (!access_token || expires_in <= authentication_time - moment()) {
			//OAuth to get our Podio access token
			rest.post('https://podio.com/oauth/token', {
				data: credentials
			}).on('complete', function (data, response) {
				if (data.access_token){
					// (Re)set current access details
					access_token = data.access_token;
					expires_in = data.expires_in;
					authentication_time = moment();

					callback();
				}
				else {
					// Return an informative error object
					callback({statusCode: response.statusCode, responseRaw: response.rawEncoded});
				}
			});
		}
		else {
			callback();
		}
	}


	/**
	 * Wrapper for REST requests.
	 * Validate credentials before making any request, then dynamically
	 * generate parameters for whichever REST function is being called
	 *
	 * @param		string		requestType		Type of REST request
	 * @param		string		requestURI		The URI for the request
	 * @param		string		requestData		Any data to be passed via the request
	 * @param		function	callback		Callback function
	 *
	 * @return		void
	 */
	function handleRestRequest (requestType, requestURI, requestData, callback) {
		var request_options = {},
			request_params = [null, requestURI],
			rest_function;

		// Validate credentials
		validateCredentials(function (err) {
			if (!err){
				// Add the access token to the request headers
				request_options.headers = {'Authorization': 'OAuth2 ' + access_token};

				// If this is a post request, add the data as a parameter
				if ('postJson' === requestType) {
					request_params.push(requestData);
				}

				// If this is a get request and there's specified data, add that to the request options object
				if ('get' === requestType && requestData) {
					request_options.data = requestData;
				}

				// Push the request options into the parameters array
				request_params.push(request_options);

				// Create a bound function with the params array using apply
				rest_function = rest[requestType].bind.apply(rest[requestType], request_params);


				// Call the rest function and handle completion
				rest_function()
					.on('complete', onRestComplete.bind(undefined, callback));
			}
			else {
				callback(err);
			}
		});
	}

	/**
	 * Called on completion of a REST reqwuest, calling the callback with either
	 * the data or response errors depending on the success of the request
	 *
	 * @param		function	callback		Callback function
	 * @param		object		data			Data returned from request
	 * @param		object		response		Response from request
	 *
	 * @return		void
	 */
	function onRestComplete (callback, data, response) {
		// If everything's ok
		if(response.statusCode === 200){
			callback(null, data);
		}
		else {
			// Return an informative error object
			callback({statusCode: response.statusCode, responseRaw: response.rawEncoded});
		}
	}

	/**
	 * Add an item to the Podio app
	 *
	 * @param   type        item_fields     Must contain valid fields for the item
	 * @param   function    callback        Function to run on completion
	 *
	 * return   void
	 */
	nodio.addNewItem = function(item_fields, callback) {
		//Prepare item field structure
		var item = {
			fields: item_fields
		};

		handleRestRequest('postJson', 'https://api.podio.com/item/app/' + credentials.app_id + '/', item, callback);
	};


	/**
	 * Get an item based on its item ID
	 *
	 * @param   integer		item_id		ID of item to retrieve (must be within the specified Podio app)
	 * @param   function	callback	Run on completion
	 *
	 * @return  void
	 */
	nodio.getItem = function (item_id, callback) {
		handleRestRequest('get', 'https://api.podio.com/item/' + item_id, null, callback);
	};


	/**
	 * Return collection of items for the current app based on a filters object
	 *
	 * @param	object		filters		field_name -> field_value filters
	 * @param	function	callback	Callback function
	 *
	 * @return	void
	 */
	nodio.filterItems = function (filters, callback) {
		handleRestRequest('postJson', 'https://api.podio.com/item/app/' + credentials.app_id + '/filter/', filters, callback);
	};


	/**
	 * Get all comments from an item based on its item ID
	 *
	 * @param	integer		item_id		ID of item from which to retrieve comments (must be within the specified Podio app)
	 * @param	function	callback	Run on completion
	 *
	 * @return  void
	 */
	nodio.getCommentsOnItem = function (item_id, callback) {
		handleRestRequest('get', 'https://api.podio.com/comment/item/' + item_id, request, callback);
	};


	/**
	 * Get an item based on its item ID
	 *
	 * @param	integer			item_id		ID of item from which to retrieve comments (must be within the specified Podio app)
	 * @param	comment_text	string		Text of comment to be added
	 * @param	function		callback	Run on completion
	 *
	 * @return  void
	 */
	nodio.addCommentToItem = function (item_id, comment_text, callback) {
		var comment = {
			value: comment_text
		};

		handleRestRequest('postJson', 'https://api.podio.com/comment/item/' + item_id, comment, callback);
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