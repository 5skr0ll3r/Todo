const { Router } = require("express"),
	userApi = require("../api/user/router.js"),
	projectApi = require("../api/project/router.js"),
	todoApi = require("../api/todo/router.js");


const dynamicRouter = Router();

dynamicRouter.use("/user", userApi);
dynamicRouter.use("/project", projectApi);
dynamicRouter.use("/todo", todoApi);

dynamicRouter.use((req,res)=>{
	return res.status(200).end();
});


module.exports = dynamicRouter;