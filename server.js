import express from "express";
import cors from "cors";
import morgan from "morgan";
import { fetchSampleUsers } from "./src/api.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/users.js";
import errorHandler from "./middleware/errorHandler.js";

if (!process.env.JWT_SECRET) {
  console.error(
    "JWT_SECRET is missing from .env -- the API cannot sign tokens.",
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));

app.use(morgan("dev"));
app.use(express.json());

const users = await fetchSampleUsers();
app.locals.users = users;

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
