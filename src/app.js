const { join } = require("path"),
	express = require("express"),
	sessionObject = require("./config/session.js"),
	renderRouter = require("./router/renderRouter.js"),
	dynamicRouter = require("./router/dynamicRouter.js");

const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "public"));

app.disable("x-powered-by");
app.use(express.json());
app.use(sessionObject);

app.use("/api", dynamicRouter);
app.use("/", renderRouter);
app.use((req,res)=>{
	res.status(200).send("uwu").end();
});


module.exports = app;