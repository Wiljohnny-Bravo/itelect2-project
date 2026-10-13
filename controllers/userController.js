import db from "../models/index.cjs";

const { User } = db;

// GET /api/users
export async function listUsers(req, res) {
  const users = await User.findAll({
    order: [["id", "ASC"]],
  });

  res.json(users);
}
