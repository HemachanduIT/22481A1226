
const Log = require("../log");

function loggerMiddleware(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} in ${duration}ms`;

    Log("backend", "info", "middleware", message);
  });

  next();
}

module.exports = loggerMiddleware;