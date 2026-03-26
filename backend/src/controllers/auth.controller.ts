import type { Request, Response } from "express";
import prisma from "../../lib/prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; // ← username → email

    // 1. Check user exists
    const user = await prisma.user.findUnique({
      where: { email }, // ← username → email
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role,  name: user.username, }, // ← username → email
      JWT_SECRET,
      { expiresIn: "20d" }
    );

   res.json({
  message: "Login successful",
  token,
  role: user.role,
  username: user.username, // ✅ add this
  email: user.email,       // ✅ add this
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};