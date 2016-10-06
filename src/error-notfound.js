'use strict';

class NotFoundError extends Error {
    constructor() {
	super();
    }
}

module.exports = NotFoundError;
