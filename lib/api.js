var rest = require('restler');
var moment = require('moment');
var _ = require('lodash');

var baseURL = 'https://api.podio.com/';

/**
 * All properties that must be provided with the credentials object
 * if there is no access token
 *
 * @type	{Array}
 */
var requiredCredentials = ['app_id','app_token','client_id','client_secret'];


/**
 * Ensure that every required property of the credentials object is present
 *
 * @param	{string}	requiredCredential	One of the required credentials
 *
 * @return	{void}
 */
var _validateRequiredCredentials = function (requiredCredential) {
	if (!_.has(this.credentials, requiredCredential)) {
		throw new Error('When not providing access_token, you must specify "' + requiredCredential + '" within your credentials');
	}
};


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
var _onRestComplete = function (callback, data, response) {
	// If everything's ok
	if (response.statusCode === 200 || response.statusCode === 201){
		return callback(null, data);
	}
	// Return an informative error object
	callback({statusCode: response.statusCode, responseRaw: response.rawEncoded});
};


/**
 * Authenticates the provided credentials against Podio's OAUTH api
 *
 * @param   function    callback        Run on completion
 *
 * @return  void
 */
var _authenticateCredentials = function (callback) {
	if (!this.credentials.accessToken || this.credentials.expiresIn <= this.credentials.authenticationTime - moment()) {
		//OAuth to get our Podio access token
		rest.post('https://podio.com/oauth/token', {
			data: this.credentials
		}).on('complete', _onAuthenticateRequestComplete.bind(this, callback));
		return;
	}
	callback(null);
};


/**
 * Once the authentication request comes back, either call the callback with
 * a useful error object, or set credential values based on what's returned
 *
 * @param	{Function}	callback	Function to run on completion
 * @param	{Object}	data		Data passed back from Podio
 * @param	{Object}	response	Details about the response from Podio
 *
 * @return	{void}
 */
var _onAuthenticateRequestComplete = function (callback, data, response) {
	if (data.access_token){
		// (Re)set current access details
		this.credentials.accessToken = data.access_token;
		this.credentials.expiresIn = data.expires_in;
		this.credentials.authenticationTime = moment();

		callback(null);
		return;
	}
	// Return an informative error object
	callback({statusCode: response.statusCode, responseRaw: response.rawEncoded});
};


/**
 * Once the user's credentials have been authenticated with Podio, compile
 * a request object with restler and send that to podio, passing the
 * results back to the onRestComplete handler.
 *
 * @param	{object}	request		description]
 * @param	{object}	err			description]
 *
 * @return	{void}
 */
var _onAuthenticatedCredentials = function (request, err) {
	if (!err){
		// Add the access token to the request headers
		request.options.headers = {'Authorization': 'OAuth2 ' + this.credentials.accessToken};

		// If this is a post request, add the data as a parameter
		if ('postJson' === request.type) {
			request.params.push(request.data);
		}

		// If this is a get request and there's specified data, add that to the request options object
		if ('get' === request.type && request.data) {
			request.options.data = request.data;
		}

		// Push the request options into the parameters array
		request.params.push(request.options);
		// Create a bound function with the params array using apply
		var restFunction = rest[request.type].bind.apply(rest[request.type], request.params);


		// Call the rest function and handle completion
		restFunction()
			.on('complete', _onRestComplete.bind(this, request.callback));
	}
	else {
		request.callback(err);
	}
};


/**
 * Constructor for the API object. Set default values for non-required properties
 * then extend that with the credentials the user passed through.
 *
 * If there's no access token already, validate that all required credential properties
 * are present
 *
 * @param	{object}	credentials		Credentials used to access Podio's API
 */
function Api (credentials) {
	/**
	 * Credentials needed for the API
	 *
	 * @type	{Object}
	 */
	this.credentials = {
		grant_type: 'app',
		expiresIn: 100,
		authenticationTime: moment()
	};

	_.extend(this.credentials, credentials);

	if (!this.credentials.access_token || this.expiresIn > this.authenticationTime - moment()) {
		_.each(requiredCredentials, _validateRequiredCredentials.bind(this));
	}
}

/**
 * Wrapper for REST requests.
 * Authenticate credentials before making any request, then dynamically
 * generate parameters for whichever REST function is being called
 *
 * @param		string		requestType		Type of REST request
 * @param		string		requestURI		The URI for the request
 * @param		string		requestData		Any data to be passed via the request
 * @param		function	callback		Callback function
 *
 * @return		void
 */
Api.prototype.handleRestRequest = function (requestType, requestURI, requestData, callback) {
	var request = {
			type: requestType,
			data: requestData,
			callback: callback,
			options: {},
			params: [null, baseURL + requestURI],
			restFunction: null
		};

	_authenticateCredentials.call(this, _onAuthenticatedCredentials.bind(this, request));
};

module.exports = Api;