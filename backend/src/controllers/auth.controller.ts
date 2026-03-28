import type { Request, Response } from "express";
import prisma from "../../lib/prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const login = async (req: Request, res: Response) => {
  try {
    // Frontend sometimes sends username instead of email; accept both
    const { email, username, password } = req.body ?? {};

    if (!password || (!email && !username)) {
      return res
        .status(400)
        .json({ message: "Email/username and password are required" });
    }

    // 1. Look up the user by either email or username
    const orFilters = [];
    if (email) orFilters.push({ email });
    if (username) orFilters.push({ username });

    const user = await prisma.user.findFirst({
      where: { OR: orFilters },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.username },
      JWT_SECRET,
      { expiresIn: "20d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
