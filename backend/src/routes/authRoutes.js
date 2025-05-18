import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const router = express.Router();

router.get('/check-auth', (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    res.json({ message: "Authenticated", user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;