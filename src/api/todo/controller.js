const connection = require("../../config/db.js"),
	queries = require("../../database/queries.js"),
	{ StatusMessages, StatusCodes, createServerResponse } = require("../../utils/responseBuilder.js");



function getTodosByProjectId(projectId){
	return new Promise((resolve, reject)=>{
		connection.query(queries.todoQueries.GetTodosByProjectId, [projectId], (error, results)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			//if(results.length === 0) resolve(createServerResponse(StatusCodes.NotFound, StatusMessages.NotFound));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success, results));
		})
	});
}

function insertTodo(body, projectId){
	return new Promise((resolve, reject)=>{
		connection.query(queries.todoQueries.InsertTodo, [body.todo_name, body.todo_description, body.type, body.state, projectId], (error, results)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			//if(results.affectedRows === 0) reject(createServerResponse(StatusCodes.NoChanges, StatusMessages.NoChanges));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success, results));
		});
	});
}

function updateTodo(body){
	return new Promise((resolve, reject)=>{
		var queryUpdate = ["UPDATE todos SET"];
		var values = [];
		body.todo_name ? (queryUpdate.push("todo_name = ?"), values.push(body.todo_name)) : null;
		body.todo_description ? (queryUpdate.push("todo_description = ?"), values.push(body.todo_description)) : null;
		body.type ? (queryUpdate.push("type = ?"), values.push(body.type)) : null;
		body.state ? (queryUpdate.push("state = ?"), values.push(body.state)) : null;
		queryUpdate.push(`WHERE _id = ${_id}`);

		queryUpdate = queryUpdate.join(" ");
		connection.query(queryUpdate, values, (error, results)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success, ));
		});
	});
}

function removeTodo(body){
	return new Promise((resolve, reject)=>{
		connection.query(queries, [body._id], (error, results)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			//if(results.affectedRows === 0) reject(createServerResponse(StatusCodes.NoChanges, StatusMessages.NoChanges));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success, results));
		});
	});
}


//SELECT t.* FROM todos t JOIN projects p ON t.project_id = p._id WHERE p.owner_id = ? AND t._id = ?;
const isOwner = function(req, res, next){
	connection.query(queries.todoQueries.Owns, [req.body._id, req.session.user._id], (error, results)=>{
		if(error) return res.status(500).json(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error)).end();
		if(results.length === 0) return res.status(404).json(createServerResponse(StatusCodes.NotFound, StatusMessages.NotFound)).end();
		return next();
	});
}

module.exports = { getTodosByProjectId, insertTodo, updateTodo, removeTodo, isOwner };