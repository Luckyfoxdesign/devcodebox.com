"use strict"

const userName = ""
const userPassword = ""

module.exports = {
	mongoConnectionString: function getConnectionString(dbName) {
		return `mongodb://${userName}:${userPassword}@localhost/${dbName}?authSource=admin`
	},
	mongoConnectionOptions: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	mongoStoreConnectionOptions: {
		url: `mongodb://${userName}:${userPassword}@localhost/sessions_db?authSource=admin`,
		collection: "sessions",
		ttl: 40,
		secret: "qwefihqrioghwi*ˆ&$#%$ˆ%&ˆ*(&)_rgjbj34b4_u4gbiu54gnksjrnegkjuwhrgu933",
	},
	dataBaseConnection: "",
}
