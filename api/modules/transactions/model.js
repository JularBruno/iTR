'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		imei: { type: String },
		supplier: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'suppliers', required: true },
		subproduct: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'subproducts', required: true },
		// type: { type: String, enum: ['add', 'substract', null] },
		sold: { type: Boolean, default: false },
		isFromSale: { type: Boolean, default: false },
		sale: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'sales' },
	}, { timestamps: true });

};
