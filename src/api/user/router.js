const { Router } = require("express"),
	controller = require("./controller.js"),
	{ getProjectsByUserId } = require("../project/controller.js"),
	sanitize = require("../../utils/dataSanitization.js"),
	{ StatusMessages, StatusCodes, createServerResponse } = require("../../utils/responseBuilder.js");


const userRouter = Router();

userRouter.get("/information", controller.isAuthenticated, (req, res)=>{
	controller.getUserById(req.session.user._id)
		.then((results)=>{
			if(!results) return res.status(404).json(createServerResponse(StatusCodes.NotFound, StatusMessages.NotFound)).end();
			return res.status(200).json(createServerResponse(StatusCodes.Success, StatusMessages.Success, results)).end();
		}).catch(async (error)=>{
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error)).end();
		});
});

userRouter.post("/login", sanitize, (req,res)=>{
	controller.authenticateUser(req.body)
		.then((user)=>{
			if(user.statusCode !== 0){
				return res.status(401).json(user).end();
			}
			getProjectsByUserId(user.data._id)
				.then((projects)=>{
					req.session.projects = projects.data;
					req.session.user = user.data;
					req.session.activeProject = null;
					req.session.todos = null;
					return res.status(200).json(user).end();
				}).catch(async (error)=>{
					await global.errorHandler.reportErrorFile(req, error);
					return res.status(500).json(error).end();
				});
		}).catch(async (error)=>{
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(error).end();
		});
});

userRouter.post("/register", sanitize, (req, res)=>{
	controller.registerUser(req.body)
		.then(async(results)=>{
			if(results.statusCode !== 0){
				return res.status(409).json(results).end();
			}
			return res.status(200).json(results).end();
		}).catch(async (error)=>{
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(error).end();
		});
});

userRouter.post("/update", controller.isAuthenticated, sanitize, (req, res)=>{
	controller.updateUser(req.body)
		.then((results)=>{
			if(results.statusCode !== 0){
				return res.status(409).json(results).end();
			}
			return res.status(200).json(results).end();
		}).catch(async (error)=>{
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(error).end();
		});
});

userRouter.get("/delete", controller.isAuthenticated, (req, res)=>{
	controller.removeUser(req.session.user._id)
		.then((results)=>{
			return res.status(200).json(results).end();
		}).catch(async (error)=>{
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(error).end();
		});
});

userRouter.get("/logout", controller.isAuthenticated, (req,res)=>{
	req.session.destroy(async function (error){
		if(error){
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(createServerResponse(StatusCodes.ServerError, StatusMessages.ServerError, error)).end();
		}
		return res.redirect("/");
	});
});

module.exports = userRouter;