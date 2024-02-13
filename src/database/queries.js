const userQueries = {
	GetUserById: "SELECT * FROM users WHERE _id = ?",
	GetUserByEmail: "SELECT * FROM users WHERE email = ?",
	InsertUser: "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)",
	DeleteUser: "DELETE FROM users WHERE _id = ?",
};

const projectQueries = {
	GetProjectById: "SELECT * FROM projects WHERE _id = ?",
	GetProjectsByUserId: "SELECT * FROM projects WHERE owner_id = ?",
	InsertProject: "INSERT INTO projects (project_name, owner_id) VALUES (?, ?)",
	UpdateProject: "UPDATE projects SET (project_name) VALUES (?)",
	DeleteProject : "DELETE FROM projects WHERE _id = ?",
	Owns: "SELECT * FROM projects WHERE owner_id = ? AND _id = ?"
};

const todoQueries = {
	GetTodoById: "SELECT * FROM todos WHERE _id = ?",
	GetTodosByProjectId: "SELECT * FROM todos WHERE project_id = ?",
	InsertTodo: "INSERT INTO todos (todo_name, todo_description, type, state, project_id) VALUES (?, ?, ?, ?, ?)",
	DeleteTodo: "DELETE FROM todos WHERE _id = ?",
	Owns: "SELECT t.* FROM todos t JOIN projects p ON t.project_id = p._id WHERE p.owner_id = ? AND t._id = ?"
};

module.exports = { userQueries, projectQueries, todoQueries };