'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		message: { type: String, required: true },
		title: { type: String, required: true },
		user: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

	}, { timestamps: true } );

};
