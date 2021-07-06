'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		code: { type: String },
		name: { type: String },
		price: { type: Number },
		stock: { type: Number, default: 0 },
		product: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
		sale: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'sales' },
	}, { timestamps: true });

};
