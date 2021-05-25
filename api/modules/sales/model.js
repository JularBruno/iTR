'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		products: { type: global.database.mongodb.mongoose.Schema.Types.Mixed },
		date: { Type: String },
		total: { type: Number },
		discount: { type: Number, default: 0 },
		client: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'customers', required: true },
		paidARS: { type: Number },
		paidUSD: { type: Number },
		paidPROD: { type: Number },

	}, { timestamps: true });

};
