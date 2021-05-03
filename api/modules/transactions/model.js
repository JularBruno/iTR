'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		stock: { type: Number },
		price: { type: Number },
		supplier: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'suppliers', required: true },
		subproduct: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
		type: { type: String, enum: ['add', 'substract', null] },
	}, { timestamps: true });

};
