var Tasks = function (dependencies) {
	this.api = dependencies.api;
};


/**
 * Add a task to podio
 *
 * @param	{object}	taskFields	The task definition
 * @param	{function}	callback	Function to run on completion
 *
 * return	{void}
 */
Tasks.prototype.create = function (task, callback) {
	this.api.handleRestRequest('postJson', 'task/', task, callback);
};

module.exports = Tasks;