var api = require('/.api');

var Tasks = {
	/**
	 * Add a task to podio
	 *
	 * @param	{object}	taskFields	The task definition
	 * @param	{function}	callback	Function to run on completion
	 *
	 * return	{void}
	 */
	create: function (task, callback) {
		api.handleRestRequest('postJson', 'task/', task, callback);
	}
};

module.exports = Tasks;