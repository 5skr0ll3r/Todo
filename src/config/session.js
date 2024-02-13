const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);


const MySQLStoreInstance = new MySQLStore({
	host: global.configuration.MYSQL_HOST,
	port: global.configuration.MYSQL_PORT,
	user: global.configuration.MYSQL_USER,
	password: global.configuration.MYSQL_PASSWORD,
	database: global.configuration.MYSQL_DATABASE,
});

const sessionObject = session({
      secret: global.configuration.MYSQL_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MySQLStoreInstance,
});

 module.exports = sessionObject;