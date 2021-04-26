'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		addresses: [{
			address: { type: String },
			addressGoogle: { type: String },
			location: {
				coordinates: { type: [Number] }, //[0] = longitude, [1] = latitude 
				type: { type: String, enum: ['Point'] }
			},
			name: { type: String },
			selected: { type: Boolean }
		}],
		birthDay: { type: Date },
		completedProfile: { type: Boolean, default: false },
		driverLicense: { type: String, unique: true },
		emailAddress: { type: String, unique: true, required: true },
		enabled: { type: Boolean, default: true },
		firstName: { type: String, required: true },
		gender: { type: String, enum: ['male', 'female', null] },
		lastName: { type: String, required: true },
		licenseNumber: { type: Number, unique: true },
		password: { type: String },
		phoneNumber: { type: Number },
		picture: { type: String },
		plateNumber: { type: Number, unique: true },
		riderAddress: { type: String },
		riderAddressGoogle: { type: String },
        riderLocation: {
			coordinates: { type: [Number] }, //[0] = longitude, [1] = latitude 
			type: { type: String, enum: ['Point'] }
        },
		riderEnabled: { type: Boolean, default: true },
		riderRequestSent: { type: Boolean, default: false },
		roles: [{ type: String, allowNull: false }],
		ruat: { type: String, unique: true },
		savedMoney: { type: Number, default: 0, min: 0 },
		username: { type: String, unique: true, required: true },
		validationCode: { type: String },
		validatedCode: { type: Boolean, default: false }

	}, { timestamps: true } );

	module.schema.post('validate', (doc) => {
		const role = 'user';
		if (!doc.roles.includes(role)) doc.roles.push(role);

		if (doc.firstName && doc.lastName && doc.emailAddress && doc.gender && doc.phoneNumber) {
			doc.completedProfile = true;
		}
	});

	module.schema.pre('findOneAndUpdate', async function(doc, next) {
		const dataNew = this._update;
		const dataCurrent = await this.model.findOne(this.getQuery());

		if (dataCurrent.completedProfile) {
			if (dataNew.firstName === null || dataNew.lastName === null || dataNew.emailAddress === null ||  dataNew.gender === null || dataNew.phoneNumber === null) {
				this._update.completedProfile = false;
			}
		}
	});
};
