'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		name: { type: String, required: true },
		phone: { type: String, required: true },
		emailAddress: { type: String, unique: true, required: true },
		spent: { type: Number, default: 0 },
		dni: { type: Number, default: 0 }

	}, { timestamps: true });

};
