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
 * Token that Podio returns to allow the interacting with an app
 *
 * @type    {Object}
 */
var accessToken;

/**
 * Number of milliseconds in which the access token expires
 *
 * @type    {integer}
 */
var expiresIn = 100;

/**
 * The time the the access token was authenticated
 *
 * @type    {Pbject}
 */
var authenticationTime = moment();

/**
 * Credentials needed for the API
 *
 * @type	{Object}
 */
var _credentials = {};


/**
 * Register the credentials to the api. If there is a non-expired access token, use that
 * otherwise validate the credentials against the required properties
 *
 * @param	{object}	credentials		Credentials passed with the first request
 *
 * @return	{void}
 */
function register (credentials) {
	_credentials = credentials;

	if (_credentials.access_token || expiresIn <= authenticationTime - moment()) {
		_access_token = _credentials.access_token;
	}
	else {
		_.each(requiredCredentials, _validateMandatoryCredentials);
	}
}


function _validateMandatoryCredentials (mandatoryCredential) {
	if (!_.has(_credentials, mandatoryCredential)) {
		throw new Error('When not providing access_token, you must specify "' + credentialName + '" within your credentials');
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
	var requestOptions = {},
		RequestParams = [null, baseURL + requestURI],
		restFunction;

	// Validate credentials
	_authenticateCredentials(function (err) {
		if (!err){
			// Add the access token to the request headers
			requestOptions.headers = {'Authorization': 'OAuth2 ' + accessToken};

			// If this is a post request, add the data as a parameter
			if ('postJson' === requestType) {
				RequestParams.push(requestData);
			}

			// If this is a get request and there's specified data, add that to the request options object
			if ('get' === requestType && requestData) {
				requestOptions.data = requestData;
			}

			// Push the request options into the parameters array
			RequestParams.push(requestOptions);

			// Create a bound function with the params array using apply
			restFunction = rest[requestType].bind.apply(rest[requestType], RequestParams);


			// Call the rest function and handle completion
			restFunction()
				.on('complete', _onRestComplete.bind(undefined, callback));
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
function _onRestComplete (callback, data, response) {
	// If everything's ok
	if(response.statusCode === 200 || response.statusCode === 201){
		callback(null, data);
	}
	else {
		// Return an informative error object
		callback({statusCode: response.statusCode, responseRaw: response.rawEncoded});
	}
}


/**
 * Authenticates the provided credentials against Podio's OAUTH api
 *
 * @param   function    callback        Run on completion
 *
 * @return  void
 */
function _authenticateCredentials (callback) {
	//We're using the app authentication flow
	_credentials.grantType = "app";


	if (!accessToken || expiresIn <= authenticationTime - moment()) {
		//OAuth to get our Podio access token
		rest.post('https://podio.com/oauth/token', {
			data: _credentials
		}).on('complete', function (data, response) {
			if (data.accessToken){
				// (Re)set current access details
				accessToken = data.accessToken;
				expiresIn = data.expiresIn;
				authenticationTime = moment();

				callback(null);
			}
			else {
				// Return an informative error object
				callback({statusCode: response.statusCode, responseRaw: response.rawEncoded});
			}
		});
	}
	else {
		callback(null);
	}
}

exports.register = register;
exports.handleRestRequest = handleRestRequest;
exports.appID = _credentials.app_id;