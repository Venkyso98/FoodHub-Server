const jwt_decode = require("jwt-decode");

const authApi = function (request, response, next) {
  const authHeader = request.headers.authorization;                   // fetches the data from header
  try {
    const token = authHeader.split(" ")[1];
    var decoded = jwt_decode(token);
    request.body.userId = decoded.userId;
    request.body.role = decoded.role;
    // next();
  } catch (e) {
    response.status(400).send({ message: "UnAuthorized Request" });
  }
};

module.exports = {
  authApi,
};
