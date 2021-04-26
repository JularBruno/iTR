'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		additionals: [{ type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'products' }],
		category: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
		company: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'companies', required: true },
		conditions: { type: String },
		description: { type: String },
		discount: { type: Number, required: true },
		dueDate: { type: Date, required: true },
		enabled: { type: Boolean, default: true },
		name: { type: String, required: true },
		options: [{
			name: { type: String },
			price: { type: Number },
		}],
		price: { type: Number, required: true },
		product: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
		status: { type: String, enum: ['available', 'expired'], default: 'available' },
		type: { type: String, enum: ['product', 'service'] },
		quantityAvailable: { type: Number, min: 0, required: true },
		quantityConsumed: { type: Number, min: 0 },

	}, { timestamps: true } );

};
