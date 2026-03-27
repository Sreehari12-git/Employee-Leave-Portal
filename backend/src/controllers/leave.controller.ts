import type { Request, Response } from "express";
import prisma from "../../lib/prisma/prisma";

export const getLeaveBalance = async (req: any, res: Response) => {
  const userId = req.user.id;

  const balance = await prisma.leaveBalance.findUnique({
    where: { userId },
  });

  res.json(balance);
};


export const applyLeave = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { type, startDate, endDate } = req.body;

    const leave = await prisma.leave.create({
      data: {
        userId,
        type,
        status: "PENDING",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    res.json({ message: "Leave applied", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateLeaveStatus = async (req: any, res: Response) => {
  try {
    const { leaveId, status } = req.body;

    const leave = await prisma.leave.findUnique({
      where: { id: leaveId },
    });

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status === "APPROVED") {
  return res.status(400).json({
    message: "Leave already approved",
  });
}

    const updatedLeave = await prisma.leave.update({
      where: { id: leaveId },
      data: { status },
    });

    if (status === "APPROVED") {
      // ✅ normalize dates to avoid timezone issues
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(0, 0, 0, 0);
      const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (leave.type === "ANNUAL") {
        await prisma.leaveBalance.upsert({
          where: { userId: leave.userId },
          update: { annualUsed: { increment: days } },
          create: { userId: leave.userId, annualTotal: 15, annualUsed: days, sickTotal: 10, sickUsed: 0 },
        });
      } else if (leave.type === "SICK") {
        await prisma.leaveBalance.upsert({
          where: { userId: leave.userId },
          update: { sickUsed: { increment: days } },
          create: { userId: leave.userId, annualTotal: 15, annualUsed: 0, sickTotal: 10, sickUsed: days },
        });
      }
    }

    res.json({ message: `Leave ${status.toLowerCase()} successfully`, updatedLeave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllLeaves = async (req: any, res: Response) => {
  const leaves = await prisma.leave.findMany({
    where: { status: "PENDING" }, // ✅ only pending
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { username: true, role: true },
      },
    },
  });
  res.json(leaves);
};

export const getMyLeaves = async (req: any, res: Response) => {
  const userId = req.user.id;

  const leaves = await prisma.leave.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }, // ✅ most recent first
  });

  res.json(leaves);
};

export const getLeaveCounts = async (req: any, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pending = await prisma.leave.count({ where: { status: "PENDING" } });

    const approvedToday = await prisma.leave.count({
      where: {
        status: "APPROVED",
        updatedAt: { gte: today, lt: tomorrow },
      },
    });

    res.json({ pending, approvedToday });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};