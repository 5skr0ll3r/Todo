const StatusMessages = {
  Success: "Success",
  InputViolation: "Special characters are not permitted in this field",
  InvalidCredentials: "Invalid Credentials",
  WrongInput: "Some fields are required please check your input and try again",
  WrongEmailFormat: "Email format is wrong",
  ConflictOnEmail: "Email is already registered please try another or if you forgot your password click on the forgot password",
  ConflictOnUsername: "Username is already registered please try another or if you forgot your password click on the forgot password",
  AccessDenied: "Access Denied",
  NotFound: "Not Found",
  NoChanges: "No changes were made",
  ServerError: "Server-Error: Something went wrong please try again",
  UndefinedError: "Something unexpected happened please contact the website owner or your Sysadmin",
};

const StatusCodes = {
  Success: 0,
  InputViolation: 10,
  InvalidCredentials: 11,
  WrongInput: 12,
  WrongEmailFormat: 13,
  ConflictOnEmail: 21,
  ConflictOnUsername: 22,
  AccessDenied: 30,
  NotFound: 31,
  NoChanges: 40,
  ServerError: 50,
  UndefinedError: 51,
};

function createServerResponse(statusCode, statusMessage, data=null) {
  return {
    statusCode,
    statusMessage,
    data,
    date: new Date()
  };
}

module.exports = { StatusMessages, StatusCodes, createServerResponse };