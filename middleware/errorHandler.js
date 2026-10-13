export default function errorHandler(err, req, res, next) {
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ error: err.errors.map((e) => e.message) });
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ error: "That email is already registered" });
  }
  console.error(err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
}
