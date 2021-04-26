'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		name: { type: String, required: true },
		stock: { type: Number, required: false, default: 0 },
	}, { timestamps: true });

};
