'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		code: { type: Number },
		name: { Type: String },
		price: { type: Number },
		stock: { type: Number, default: 0 },
		product: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
	}, { timestamps: true });

};
