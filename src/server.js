const ConfigurationManager = require("./managers/configurationManager.js");

const configurationManager = new ConfigurationManager(".env");
global.configuration = configurationManager.getConfiguration();

const ErrorHandler = require("./utils/errorHandler.js");
global.errorHandler = new ErrorHandler(configuration.LOG_ERROR_FILE_PATH);


const app = require("./app.js");
app.listen(configuration.APP_PORT, (err)=>{
	if(err) throw new Error(err);
	console.log(`Listening on 127.0.0.1:${configuration.APP_PORT}`);
});