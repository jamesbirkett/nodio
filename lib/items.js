var Items = function (dependencies) {
	this.api = dependencies.api;
};

/**
 * Get an item based on its item ID
 *
 * @param	{integer}		itemID		ID of item to retrieve (must be within the specified Podio app)
 * @param	{function}	callback	Run on completion
 *
 * @return	{void}
 */
Items.prototype.get = function (itemID, callback) {
	this.api.handleRestRequest('get', 'item/' + itemID, null, callback);
};


/**
 * Add an item to the specified Podio app
 *
 * @param	{type}        itemFields     Must contain valid fields for the item
 * @param	{function}    callback        Function to run on completion
 *
 * return	{void}
 */
Items.prototype.create = function (itemFields, callback) {
	var item = {
		fields: itemFields
	};

	this.api.handleRestRequest('postJson', 'item/app/' + this.api.credentials.app_id + '/', item, callback);
};


/**
 * Return collection of items for the current app based on a filters object
 *
 * @param	{object}		filters		field_name -> field_value filters
 * @param	{function}		callback	Callback function
 *
 * @return	{void}
 */
Items.prototype.filter = function (filters, callback) {
	this.api.handleRestRequest('postJson', 'item/app/' + this.api.credentials.app_id + '/filter/', filters, callback);
};


/**
 * Get all comments from an item based on its item ID
 *
 * @param	{integer}		itemID		ID of item from which to retrieve comments (must be within the specified Podio app)
 * @param	{function}		callback	Run on completion
 *
 * @return	{void}
 */
Items.prototype.getComments = function (itemID, callback) {
	this.api.handleRestRequest('get', 'comment/item/' + itemID, null, callback);
};


/**
 * Get an item based on its item ID
 *
 * @param	{integer}		itemID			ID of item from which to retrieve comments (must be within the specified Podio app)
 * @param	{string}		commentText		Text of comment to be added
 * @param	{function}		callback		Run on completion
 *
 * @return	{void}
 */
Items.prototype.addComment = function (itemID, commentText, callback) {
	var comment = {
		value: commentText
	};

	this.api.handleRestRequest('postJson', 'comment/item/' + itemID, comment, callback);
};

module.exports = Items;