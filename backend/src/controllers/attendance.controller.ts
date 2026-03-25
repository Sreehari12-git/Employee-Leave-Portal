import type { Request, Response } from "express";
import prisma from "../../lib/prisma/prisma";


export const clockIn = async (req: any, res: Response) => {
  const userId = req.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // check if already exists today
  const existing = await prisma.attendance.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  if (existing && existing.checkIn) {
    return res.status(400).json({ message: "Already clocked in" });
  }

  const attendance = await prisma.attendance.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      checkIn: new Date(),
      status: "PRESENT",
    },
    create: {
      userId,
      date: today,
      checkIn: new Date(),
      status: "PRESENT",
    },
  });

  res.json({ message: "Clocked in", attendance });
};

export const clockOut = async (req: any, res: Response) => {
  const userId = req.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  if (!attendance || !attendance.checkIn) {
    return res.status(400).json({ message: "Not clocked in" });
  }

  if (attendance.checkOut) {
    return res.status(400).json({ message: "Already clocked out" });
  }

  const checkOutTime = new Date();

  const duration =
    (checkOutTime.getTime() - new Date(attendance.checkIn!).getTime()) /
    (1000 * 60); // minutes

  const updated = await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      checkOut: checkOutTime,
      duration: Math.floor(duration),
    },
  });

  res.json({ message: "Clocked out", updated });
};

export const getTodayStatus = async (req: any, res: Response) => {
  const userId = req.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  res.json({
    attendance,
    isClockedIn: attendance && !attendance.checkOut,
  });
};