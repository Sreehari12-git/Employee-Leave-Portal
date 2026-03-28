import type { Request, Response } from "express";
import prisma from "../../lib/prisma/prisma";
import bcrypt from "bcrypt";


export const getDashboard = async (req: any, res: Response) => {
  const userId = req.user.id;

  // 👤 user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true },
  });

  // 📅 today start
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ⏱️ attendance
  const attendance = await prisma.attendance.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  // 👥 team presence
  const onlineUsers = await prisma.attendance.count({
    where: {
      clockOut: null,
    },
  });

  const totalUsers = await prisma.user.count();

  // 📜 recent logs
  const logs = await prisma.attendance.findMany({
    take: 5,
    orderBy: { clockIn: "desc" },
    include: {
      user: {
        select: { username: true },
      },
    },
  });

  res.json({
    greeting: `Good morning, ${user?.username}`,

    attendance: {
      checkIn: attendance?.clockIn,
      checkOut: attendance?.clockOut,
      isClockedIn: attendance && !attendance.clockOut,
      duration: attendance?.duration,
    },

    team: {
      online: onlineUsers,
      total: totalUsers,
    },

    recentLogs: logs,
  });
};

export const createUser = async (req: any, res: Response) => {
  try {
    const { email, username, password, role } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: role || "USER",

        // 👇 auto create leave balance
        leaveBalance: {
          create: {},
        },
      },
    });

    res.json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};