const { StatusMessages, StatusCodes, createServerResponse } = require("./responseBuilder.js");

const emailRegCheck = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
const onlyCharsReg = "[a-zA-Z]";
const dNameReg = "['\"-/\\~`(){}\[\]:;><?^=\+]";
const todoState = "todo|pending|done";
const wrongInput = createServerResponse(StatusCodes.WrongInput, StatusCodes.WrongInput);
const wrongEmailFormat = createServerResponse(StatusCodes.WrongEmailFormat, StatusMessages.WrongEmailFormat);
const inputViolation = createServerResponse(StatusCodes.InputViolation, StatusMessages.InputViolation);
const notFound = createServerResponse(StatusCodes.NotFound, StatusMessages.NotFound);

//HEAR YOURSELF AND RETURN ON ALL
//In Express middlewares if the next() method is called, it will create a new frame on the callstack
//for the next middleware, but the current middleware will continue it's execution and wont exit,
//it stays on the call stack until the entire middleware chain completes. This may introduce a
//code: 'ERR_HTTP_HEADERS_SENT' since the code execution continues the sanitizer in this case in the end 
//will attempt to respond with the follwing line `return res.status(401).json(notFound).end();`,
//following that if the next() method was called and the next middleware attempts to also respond
//to the client the "Cannot set headers after they are sent to the client" is inevitable
//FIX: always return after next() is called 



//TODO: change status code to corrrect ones for each case
//TODO: split checks in order to return correct responses when it comes to inputViolation and wrongInput
function sanitizeData(req, res, next){
	const url = req.originalUrl;

	if(url == "/api/user/login"){
		if(!req.body.email || !req.body.password){
			return res.status(401).json(wrongInput).end();
		}
		if(!req.body.email.match(emailRegCheck)){
			return res.status(401).json(wrongEmailFormat).end();
		}
		return next();
	}

	if(url == "/api/user/register"){
		if(!req.body.first_name || !req.body.last_name || !req.body.username || !req.body.email || !req.body.password){
			return res.status(401).json(wrongInput).end();
		}
		if(!req.body.email.match(emailRegCheck)){
			return res.status(401).json(wrongEmailFormat).end();
		}
		if(!req.body.first_name.match(onlyCharsReg) || !req.body.last_name.match(onlyCharsReg) || req.body.username.match(dNameReg)){
			return res.status(401).json(inputViolation).end();
		}
		return next();
	}

	if(url == "/api/user/update"){
		if(req.body.first_name && !req.body.first_name.match(onlyCharsReg)){
			return res.status(401).json(inputViolation).end();
		}
		if(req.body.last_name && !req.body.last_name.match(onlyCharsReg)){
			return res.status(401).json(inputViolation).end();
		}
		if(req.body.username && req.body.username.match(dNameReg)){
			return res.status(401).json(inputViolation).end();
		}
		if(req.body.email && !req.body.email.match(emailRegCheck)){
			return res.status(401).json(inputViolation).end();
		}
		return next();
	}

	if(url == "/api/project/project"){
		if(isNaN(req.body._id)){
			return res.status(401).json(inputViolation).end();
		}
		return next();
	}

	if(url == "/api/project/insert"){

		if(!req.body.project_name){
			return res.status(401).json(wrongInput).end();
		}
		if(req.body.project_name.match(dNameReg)){
			return res.status(401).json(inputViolation).end();
		}
		return next();
	}

	if(url == "/api/project/update"){
		if(req.body.project_name && req.body.project_name.match(dNameReg)){
			return res.status(401).json(wrongInput).end();
		}
		return next();
	}

	if(url == "/api/project/remove"){
		if(isNaN(req.body._id)){
			return res.status(401).json(inputViolation).end();
		}
		return next();
	}

	if(url == "/api/todo/insert"){
		if(!req.body.todo_name || !req.body.todo_description || !req.body.type || !req.body.state){
			return res.status(401).json(wrongInput).end();
		}
		if(req.body.todo_name.match(dNameReg) || req.body.todo_description.match(dNameReg) || !req.body.type.match(onlyCharsReg) || !req.body.state.match(onlyCharsReg) || !req.body.state.match(todoState)){
			return res.status(401).json(inputViolation).end();
		}
		return next();
	}

	if(url == "/api/todo/update"){
		if(req.body.todo_name && req.body.todo_name.match(dNameReg)){
			return res.status(401).json(inputViolation).end();
		}
		if(req.body.todo_description && req.body.todo_description.match(dNameReg)){
			return res.status(401).json(inputViolation).end();
		}
		if(req.body.type && req.body.type.match(onlyCharsReg)){
			return res.status(401).json(inputViolation).end();
		}
		if(req.body.state && req.body.state.match(onlyCharsReg)){
			return res.status(401).json(inputViolation).end();
		}
		return next();
	}

	if(url == "/api/todo/remove"){
		if(isNaN(req.body._id)){
			return res.status(401).json(inputViolation).end();
		}
		return next();
	}

	return res.status(404).json(notFound).end();
}


module.exports = sanitizeData;