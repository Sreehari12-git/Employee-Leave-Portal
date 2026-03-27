// controllers/user.controller.ts
import type { Request, Response } from "express";
import prisma from "../../lib/prisma/prisma";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
        role,
        leaveBalance: {
          create: {
            annualTotal: 15,
            annualUsed: 0,
            sickTotal: 10,
            sickUsed: 0,
          },
        },
      },
    });

    res.json({ message: "Employee created successfully", user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};