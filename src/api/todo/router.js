const { isAuthenticated } = require("../user/controller.js"),
	controller = require("./controller.js"),
	projectController = require("../project/controller.js"),
	{ Router } = require("express"),
	sanitize = require("../../utils/dataSanitization.js"),
	{ StatusMessages, StatusCodes, createServerResponse } = require("../../utils/responseBuilder.js");


const todoRouter = Router();

todoRouter.post("/insert", isAuthenticated, sanitize, (req, res)=>{
	controller.insertTodo(req.body, req.session.activeProject._id)
		.then((results)=>{
			controller.getTodosByProjectId(req.session.activeProject._id)
				.then((results)=>{
					console.log(results);
					req.session.todos = results.data;
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

todoRouter.post("/update", isAuthenticated, sanitize, controller.isOwner, (req, res)=>{
	controller.updateTodo(req.body)
	.then((results)=>{
		return res.redirect("/project");
	}).catch(async (error)=>{
			await global.errorHandler.reportErrorFile(req, error);
			return res.status(500).json(error).end();
	});
});


todoRouter.post("/remove", isAuthenticated, sanitize, controller.isOwner, (req,res)=>{
	controller.removeTodo(req.body)
	.then((results)=>{
		return res.redirect("/project");
	}).catch(async (error)=>{
		await global.errorHandler.reportErrorFile(req, error);
		return res.status(500).json(error).end();
	});
});


module.exports = todoRouter;