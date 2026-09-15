import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import morgan from "morgan";
import { fetchSampleUsers } from "./src/api.js";
import authRouter from "./routes/auth.js";

if (!process.env.JWT_SECRET) {
  console.error(
    "JWT_SECRET is missing from .env -- the API cannot sign tokens.",
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const users = await fetchSampleUsers();
app.locals.users = users;

app.use("/api/auth", authRouter);
app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ error: err.errors.map((e) => e.message) });
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ error: "That email is already registered" });
  }
  console.error(err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
