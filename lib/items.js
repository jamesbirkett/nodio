var api = require('./api');

var Items = {
	/**
	 * Get an item based on its item ID
	 *
	 * @param	{integer}		itemID		ID of item to retrieve (must be within the specified Podio app)
	 * @param	{function}	callback	Run on completion
	 *
	 * @return	{void}
	 */
	get: function (itemID, callback) {
		api.handleRestRequest('get', 'item/' + itemID, null, callback);
	},


	/**
	 * Add an item to the specified Podio app
	 *
	 * @param	{type}        itemFields     Must contain valid fields for the item
	 * @param	{function}    callback        Function to run on completion
	 *
	 * return	{void}
	 */
	create: function (itemFields, callback) {
		var item = {
			fields: itemFields
		};

		api.handleRestRequest('postJson', 'item/app/' + credentials.appID + '/', item, callback);
	},


	/**
	 * Return collection of items for the current app based on a filters object
	 *
	 * @param	{object}		filters		field_name -> field_value filters
	 * @param	{function}		callback	Callback function
	 *
	 * @return	{void}
	 */
	filter: function (filters, callback) {
		api.handleRestRequest('postJson', 'item/app/' + credentials.appID + '/filter/', filters, callback);
	},


	/**
	 * Get all comments from an item based on its item ID
	 *
	 * @param	{integer}		itemID		ID of item from which to retrieve comments (must be within the specified Podio app)
	 * @param	{function}		callback	Run on completion
	 *
	 * @return	{void}
	 */
	getComments: function (itemID, callback) {
		api.handleRestRequest('get', 'item/' + itemID, null, callback);
	},


	/**
	 * Get an item based on its item ID
	 *
	 * @param	{integer}		itemID			ID of item from which to retrieve comments (must be within the specified Podio app)
	 * @param	{string}		commentText		Text of comment to be added
	 * @param	{function}		callback		Run on completion
	 *
	 * @return	{void}
	 */
	addComment: function (itemID, commentText, callback) {
		var comment = {
			value: commentText
		};

		api.handleRestRequest('postJson', 'item/' + itemID, comment, callback);
	}
};

module.exports = Items;