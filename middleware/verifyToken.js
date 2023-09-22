const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      errorType: "Token non presente",
      statusCode: 401,
      message: "Per poter utilizzare questo endpoint è necessario un token di autorizzazione",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        errorType: "Token non valido",
        statusCode: 403,
        message: "Il token fornito non è valido.",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        errorType: "Token scaduto",
        statusCode: 403,
        message: "Il token fornito è scaduto.",
      });
    } else {
      return res.status(500).json({
        errorType: "Errore interno del server",
        statusCode: 500,
        message: "Si è verificato un errore interno del server durante la verifica del token.",
      });
    }
  }
};
