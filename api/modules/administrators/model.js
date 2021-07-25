'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		username: { type: String, unique: true },
		password: { type: String, unique: true },
		roles: [{ type: String, allowNull: false }],
	}, { timestamps: true });

	module.schema.post('validate', function (doc) {
		const role = 'administrator';
		if (!doc.roles.includes(role)) {
			doc.roles.push(role);
		}
	});

};
