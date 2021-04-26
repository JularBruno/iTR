'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		invoiceNit: { type: Number, required: true },
		invoiceNitName: { type: String, required: true },
		number: { type: Number },
		paymentType: { type: String, enum: ['debit', 'cash', 'credit'], required: true },
		paymentDate: { type: Date },
		preferredDate: { type: Date },
		totalPrice: { type: Number, required: true },
		shippingAddress: { type: String },
		shippingAddressReference: { type: String },
		shippingPrice: { type: Number },
		shippingWillBeRecibedBy: { type: String },
		rider: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users' },
		status: { type: String, enum: ['cancelled', 'finished', 'inCart', 'pending', 'process' ], default: 'inCart' },
		user: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

	}, { timestamps: true } );

};
