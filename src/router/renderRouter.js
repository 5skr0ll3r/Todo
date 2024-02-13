const { Router } = require("express"),
	{ isAuthenticated } = require("../api/user/controller.js");
	//{isAuthenticated } = require("../api/auth.js");

const renderRouter = Router();

renderRouter.get("/about", (req, res)=>{
	return res.render("about");
});

renderRouter.get("/register", (req, res)=>{
	return res.render("register");
});

renderRouter.get("/login", (req, res)=>{
	return res.render("login");
});

renderRouter.get("/profile", isAuthenticated, (req, res)=>{
	return res.render("profile", { user: req.session.user });
});

renderRouter.get("/projects", isAuthenticated, (req, res)=>{
	return res.render("projects", { user: req.session.user, projects: req.session.projects });
});

renderRouter.get("/project", isAuthenticated, (req, res)=>{
	console.log(req.session.todos);
	return res.render("project", { user: req.session.user.data, project: req.session.activeProject, todos: req.session.todos });
});

renderRouter.use((req,res)=>{
	return res.render("home", { user: req.session.user });
});

module.exports = renderRouter;