const delay = require('delay');

export const pMinDelay = async (promise, minimumDelay, options) => {
	options = {
		delayRejection: true,
		...options
	};

	let promiseError;

	if (options.delayRejection) {
		promise = promise.catch(error => {
			promiseError = error;
		});
	}

	const value = await Promise.all([promise, delay(minimumDelay)]);
	return promiseError ? Promise.reject(promiseError) : value[0];
};
