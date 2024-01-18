const timeLogger = (req, res, next) => {
  console.log("Time:", Date.now());
  next();
};

const requestLogger = (req, res, next) => {
  console.log(`Request to: ${req.method} ${req.url}`);
  next();
};

const requestModifier = (req, res, next) => {
  req.modified = true;
  req.user = {
    name: "John Doe",
    email: "johndoe@example.com",
  };

  next();
};

const checkToken = (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (token !== "SECRET_TOKEN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
export { timeLogger, requestLogger, requestModifier, checkToken };
