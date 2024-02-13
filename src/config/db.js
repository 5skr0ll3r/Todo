const { createPool } = require("mysql2");

const connection = createPool({
	host: global.configuration.MYSQL_HOST,
	port: global.configuration.MYSQL_PORT,
	user: global.configuration.MYSQL_USER,
	password: global.configuration.MYSQL_PASSWORD,
	database: global.configuration.MYSQL_DATABASE,
	multipleStatements: true
});

module.exports = connection;