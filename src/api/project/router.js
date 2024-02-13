const { Router } = require("express"),
	controller = require("./controller.js"),
	{ getTodosByProjectId } = require("../todo/controller.js"),
	{ isAuthenticated } = require("../user/controller.js"),
	sanitize = require("../../utils/dataSanitization.js"),
	{ StatusMessages, StatusCodes, createServerResponse } = require("../../utils/responseBuilder.js");


const projectRouter = Router();


projectRouter.post("/project", isAuthenticated, sanitize, controller.isOwner, (req,res)=>{
	controller.getProjectById(req.body)
		.then((results)=>{
			req.session.activeProject = results.data;
			getTodosByProjectId(results.data._id)
				.then((todos)=>{
					req.session.todos = todos.data;
					return res.redirect("/project");
				}).catch(async (error)=>{
					await global.errorHandler.reportErrorFile(req, error);
					return res.status(500).json(error).end();
				});
		}).catch(async (error)=>{
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(error).end();
		});
});

projectRouter.get("/projects", isAuthenticated, (req,res)=>{
	controller.getProjectsByUserId(req.session.user._id)
		.then((results)=>{
			req.session.projects = results;
			return res.status(200).json(results).end();
		}).catch(async (error)=>{
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(error).end();
		});
});

projectRouter.post("/insert", isAuthenticated, sanitize, (req, res)=>{
	controller.insertProject(req.body, req.session.user)
		.then((results)=>{
			controller.getProjectsByUserId(req.session.user._id)
				.then((projects)=>{
					req.session.projects = projects.data;
					return res.redirect("/projects");
				}).catch(async (error)=>{
					await global.errorHandler.reportErrorFile(req, error);
					return res.status(500).json(error).end();
				});
		}).catch(async (error)=>{
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(error).end();
		});
});

projectRouter.post("/update", isAuthenticated, sanitize, controller.isOwner, (req, res)=>{
	controller.updateProject(req.body)
	.then((results)=>{
		controller.getProjectsByUserId(req.session.user._id)
			.then((projects)=>{
				req.session.projects = projects.data;
				return res.redirect("/projects");
			}).catch(async (error)=>{
				await global.errorHandler.reportErrorFile(req, error);
				return res.status(500).json(error).end();
			});
	}).catch(async (error)=>{
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(error).end();
	});
});


projectRouter.post("/remove", isAuthenticated, sanitize, controller.isOwner, (req,res)=>{
	controller.removeProject(req.body)
	.then((results)=>{
		controller.getProjectsByUserId(req.session.user._id)
			.then((results)=>{
				req.session.projects = results;
				return res.status(200).json(results).end();
			}).catch(async (error)=>{
				await global.errorHandler.reportErrorFile(req, error);
				return res.status(500).json(error).end();
			});
	}).catch(async (error)=>{
		await global.errorHandler.reportErrorFile(req, error);
		return res.status(500).json(error).end();
	});
});


module.exports = projectRouter;