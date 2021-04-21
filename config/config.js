"use strict"

module.exports = {
	mongoConnectionString: function getConnectionString(dbName) {
		return `mongodb://${process.env.DBUSRNAME}:${process.env.DBUSRPWD}@localhost/${dbName}?authSource=admin`
	},
	mongoConnectionOptions: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	mongoStoreConnectionOptions: {
		url: `mongodb://${process.env.DBUSRNAME}:${process.env.DBUSRPWD}@localhost/sessions_db?authSource=admin`,
		collection: "sessions",
		ttl: 40,
		secret: "qwefihqrioghwi*ˆ&$#%$ˆ%&ˆ*(&)_rgjbj34b4_u4gbiu54gnksjrnegkjuwhrgu933",
	},
	dataBaseConnection: "",
}
