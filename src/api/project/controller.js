const connection = require("../../config/db.js"),
	queries = require("../../database/queries.js"),
	{ StatusMessages, StatusCodes, createServerResponse } = require("../../utils/responseBuilder.js");


//TODO: All functions do the same attempt to unify them by supplying the request as an argument
function getProjectsByUserId(userId){
	return new Promise((resolve, reject)=>{
		connection.query(queries.projectQueries.GetProjectsByUserId, [userId], (error, results)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			if(!results || results.length === 0) resolve(createServerResponse(StatusCodes.NotFound, StatusMessages.NotFound));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success, results));
		});
	});
}
function getProjectById(body){
	return new Promise((resolve, reject)=>{
		connection.query(queries.projectQueries.GetProjectById, [body._id], (error,results)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			if(!results || results.length === 0) resolve(createServerResponse(StatusCodes.NotFound, StatusMessages.NotFound));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success, results[0]));
		});
	});
}

function insertProject(body, user){
	return new Promise((resolve, reject)=>{
		connection.query(queries.projectQueries.InsertProject, [body.project_name, user._id], (error, results)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			if(!results.affectedRows || results.affectedRows === 0) reject(createServerResponse(StatusCodes.NoChanges, StatusMessages.NoChanges));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success, results));
		});
	});
}

function updateProject(body){
	return new Promise((resolve, reject)=>{
		connection.query(queries.projectQueries.UpdateProject, [body.project_name], (error, results)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			if(!results.affectedRows || results.affectedRows === 0) reject(createServerResponse(StatusCodes.NoChanges, StatusMessages.NoChanges));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success, results));
		});
	});
}
function removeProject(body){
	return new Promise((resolve, reject)=>{
		connection.query(queries.projectQueries.DeleteProject, [body._id], (error, results)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			if(!results.affectedRows || results.affectedRows === 0) reject(createServerResponse(StatusCodes.NoChanges, StatusMessages.NoChanges));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success, results));
		});
	});
}

const isOwner = function(req, res, next){
	connection.query(queries.projectQueries.Owns, [req.session.user._id, req.body._id], (error, results)=>{
		if(error) return res.status(500).json(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error)).end();
		if(results.length === 0) return res.status(404).json(createServerResponse(StatusCodes.NotFound, StatusMessages.NotFound)).end();
		return next();
	});
}

module.exports = { getProjectsByUserId, getProjectById, insertProject, updateProject, removeProject, isOwner };

