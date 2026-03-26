import type { Response } from "express";
import prisma from "../../lib/prisma/prisma";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getStatus = (clockIn: Date, totalMinutes: number, isOnLeave: boolean): string => {
  if (isOnLeave) return "EXCUSED";
  if (totalMinutes < 480) return "UNDERTIME";
  if (totalMinutes > 540) return "OVERTIME";
  const hour = clockIn.getHours();
  const min = clockIn.getMinutes();
  if (hour > 9 || (hour === 9 && min > 0)) return "LATE IN";
  return "ON TIME";
};

export const clockIn = async (req: any, res: Response) => {
  try {
    const userId = req.user.id as number;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

const day: string = DAYS[new Date().getDay()] ?? "Unknown";

    const existing = await prisma.attendance.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    if (existing?.clockIn) {
      return res.status(400).json({ message: "Already clocked in" });
    }

    const leave = await prisma.leave.findFirst({
      where: {
        userId,
        status: "APPROVED",
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });

    const attendance = await prisma.attendance.upsert({
      where: { userId_date: { userId, date: today } },
      update: {
        clockIn: new Date(),
        day,
        status: leave ? "EXCUSED" : "ON TIME",
        leaveType: leave?.type ?? null,
      },
      create: {
        userId,
        date: today,
        day,
        clockIn: new Date(),
        status: leave ? "EXCUSED" : "ON TIME",
        leaveType: leave?.type ?? null,
      },
    });

    res.json({ message: "Clocked in", attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const clockOut = async (req: any, res: Response) => {
  try {
    const userId = req.user.id as number;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    if (!attendance?.clockIn) {
      return res.status(400).json({ message: "Not clocked in" });
    }

    if (attendance.clockOut) {
      return res.status(400).json({ message: "Already clocked out" });
    }

    const clockOutTime = new Date();

    const totalMinutes = Math.floor(
      (clockOutTime.getTime() - new Date(attendance.clockIn).getTime()) / (1000 * 60)
    );

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const duration = `${hours}h ${mins}m`;
    const totalHours = parseFloat((totalMinutes / 60).toFixed(2));

    const isOnLeave = attendance.status === "EXCUSED";
    const status = getStatus(new Date(attendance.clockIn), totalMinutes, isOnLeave);

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut: clockOutTime,
        duration,
        totalHours,
        status,
      },
    });

    res.json({ message: "Clocked out", updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTodayStatus = async (req: any, res: Response) => {
  try {
    const userId = req.user.id as number;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    res.json({
      attendance,
      isClockedIn: !!(attendance?.clockIn && !attendance?.clockOut),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyAttendance = async (req: any, res: Response) => {
  try {
    const userId = req.user.id as number;

    const records = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAttendance = async (req: any, res: Response) => {
  try {
    const records = await prisma.attendance.findMany({
      orderBy: { date: "desc" },
      include: {
        user: { select: { username: true, email: true } },
      },
    });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getTeamStatus = async (req: any, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

  const users = await prisma.user.findMany({
  where: {
    role: { not: "ADMIN" }, // ✅ show everyone except admin
  },
  select: {
    id: true,
    username: true,
    email: true,
    role:true,
    attendance: {
      where: { date: today },
      take: 1,
      select: {
        clockIn: true,
        clockOut: true,
        status: true,
        leaveType: true,
      },
    },
  },
});

    const team = users.map((user) => {
      const att = user.attendance[0];
      let presenceStatus = "OUT OFFICE"; // default

      if (att?.leaveType) {
        presenceStatus = "ON LEAVE";
      } else if (att?.clockIn && !att?.clockOut) {
        presenceStatus = "PRESENT";
      } else if (att?.clockIn && att?.clockOut) {
        presenceStatus = "OUT OFFICE";
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        presenceStatus,
        clockIn: att?.clockIn ?? null,
        clockOut: att?.clockOut ?? null,
      };
    });

    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};