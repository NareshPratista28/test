import response from "../response.js";
import { query } from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  let roles = "student";

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Semua field harus diisi!" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password tidak sesuai!" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(name, email, hashedPassword);
    const result = await query(
      "INSERT INTO users (name, email, password, roles) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, roles]
    );

    res.status(200).json({ message: "Success", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return response(400, null, "Semua field harus diisi!", res);
  }

  try {
    const [result] = await query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (result.length === 0) {
      return response(404, null, "User not found", res);
    }
    const validPassword = await bcrypt.compare(password, result.password);
    if (!validPassword) {
      return response(401, null, "Invalid password", res);
    }
    const token = jwt.sign({ user: result }, process.env.ACCESS_TOKEN_SECRET);

    const bearerToken = `Bearer ${token}`;

    response(200, { ...result, bearerToken }, "Success", res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM users`);
    response(200, result, "Success", res);
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`SELECT * FROM users WHERE id = ?`, [id]);
    response(200, result, "Success", res);
  } catch (error) {
    console.log(error);
  }
};
