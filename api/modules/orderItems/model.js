'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		additional: { type: Boolean },
		coupon: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'coupons' },
		dueDate: { type: Date },
		optionName: { type: String },
		optionPrice: { type: Number },
		order: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'orders' },
		product: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'products' },
		productPrice: { type: Number },
		price: { type: Number },
		quantity: { type: Number, min: 1 },
		reserved: { type: Boolean, default: false },
		totalPrice: { type: Number, required: true },
		user: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
		
	}, { timestamps: true } );

};
