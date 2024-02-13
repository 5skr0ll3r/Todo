const { hash, compare } = require("bcrypt"),
	connection = require("../../config/db.js"),
	queries = require("../../database/queries.js"),
	{ StatusMessages, StatusCodes, createServerResponse } = require("../../utils/responseBuilder.js");


function getUserById(id){
	return new Promise((resolve, reject)=>{
		connection.query(queries.userQueries.GetUserById, [id], (error, results)=>{
			if(error){
				reject(error);
			}
			if(!results || results.length === 0){
				resolve(false);
			}
			delete results.password;//Delete only here 
			resolve(results);
		});
	});
}

function getUserByEmail(email){
	return new Promise((resolve, reject)=>{
		connection.query(queries.userQueries.GetUserByEmail, [email], (error, results)=>{
			if(error){
				reject(error);
			}
			if(results == undefined || results.length === 0){
				resolve(false);
			}
			resolve(results[0]);
		});
	});
}


function authenticateUser(body){
	return new Promise((resolve, reject)=>{
		getUserByEmail(body.email).then((results)=>{
			if(!results){
				resolve(createServerResponse(StatusCodes.InvalidCredentials, StatusMessages.InvalidCredentials));
			}
			compare(body.password, results.password, (error, isMatch)=>{
				if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
				if(!isMatch) resolve(createServerResponse(StatusCodes.InvalidCredentials, StatusMessages.InvalidCredentials));
				delete results.password;
				resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success, results));
			});
		}).catch((error)=>{
			reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
		});
	});
}


function registerUser(body){
	return new Promise((resolve, reject)=>{
		hash(body.password, parseInt(global.configuration.PASS_SALT_ROUNDS), (error, passwordHash)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			connection.query(queries.userQueries.InsertUser, [body.first_name, body.last_name, body.username, body.email, passwordHash], (error, results)=>{
				if(error){
					if(error.errno === 1062){
						if(error.sqlMessage.includes("email")){
							resolve(createServerResponse(StatusCodes.ConflictOnEmail, StatusMessages.ConflictOnEmail));
						}
						resolve(createServerResponse(StatusCodes.ConflictOnUsername, StatusMessages.ConflictOnUsername));
					}
					reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
				}
				if(!results.affectedRows || results.affectedRows === 0) reject(createServerResponse(StatusCodes.NoChanges, StatusMessages.NoChanges));
				resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success));
			});
		})
	});
}
//TODO: check for 0 affected rows
function updateUser(body){
	return new Promise(async (resolve, reject)=>{
		var queryUpdate = ["UPDATE users SET"];
		var values = [];
		body.first_name ? (query.push("first_name = ?"), values.push(body.first_name)) : null;
		body.last_name ? (query.push("last_name = ?"), values.push(body.last_name)) : null;
		body.username ? (query.push("username = ?"), values.push(body.username)) : null;
		body.email ? (query.push("email = ?"), values.push(body.email)) : null;

		if(body.password){
			try{
				const passwordHash = await hash(body.password, global.configuration.PASS_SALT_ROUNDS);
				queryUpdate.push(`password = ?`);
				values.push(passwordHash);
			}catch(error){ 
				reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			}

		}
		queryUpdate.push(`WHERE _id = ${_id}`);

		queryUpdate = queryUpdate.join(" ");
		connection.query(queryUpdate, values, (error, results)=>{
			if(error){
				if(error.errno === 1062){
					if(error.sqlMessage.includes("email")){
						resolve(createServerResponse(StatusCodes.ConflictOnEmail, StatusMessages.ConflictOnEmail));
					}
					resolve(createServerResponse(StatusCodes.ConflictOnUsername, StatusMessages.ConflictOnUsername));
				}
				reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			}
			if(results.affectedRows === 0) reject(createServerResponse(StatusCodes.NoChanges, StatusMessages.NoChanges));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success));
		});
	});
}

function removeUser(id){
	return new Promise((resolve, reject)=>{
		connection.query(queries.userQueries.DeleteUser, [id], (error, results)=>{
			if(error) reject(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error));
			if(results.affectedRows === 0) reject(createServerResponse(StatusCodes.NoChanges, StatusMessages.NoChanges));
			resolve(createServerResponse(StatusCodes.Success, StatusMessages.Success));
		});
	});
}

const isAuthenticated = function (req,res,next){
	if(req.session.user) return next();
	return res.redirect("/login");
}


module.exports = { authenticateUser, registerUser, updateUser, isAuthenticated, getUserById, getUserByEmail };



