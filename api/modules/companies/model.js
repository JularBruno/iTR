'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		address: { type: String },
		addressGoogle: { type: String },
		businessName: { type: String, required: true, unique: true },
		description: { type: String },
		enabled: { type: Boolean, default: true },
		emailAddress: { type: String, unique: true },
		invoice: { type: Boolean },
		legalRepresentative: { type: String },
		location: {
			coordinates: { type: [Number] }, //[0] = longitude, [1] = latitude 
			type: { type: String, enum: ['Point'] }
		},
		name: { type: String },
		nit: { type: Number, unique: true },
		phoneNumber: { type: Number },
		picture: { type: String },
		scheduleClosing: { type: Date },
		scheduleOpening: { type: Date },
		tradeLicense: { type: String, unique: true },

	}, { timestamps: true } );

};
