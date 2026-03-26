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
    const { leaveId, status } = req.body; // APPROVED / REJECTED

    const leave = await prisma.leave.findUnique({
      where: { id: leaveId },
    });

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // update leave status
    const updatedLeave = await prisma.leave.update({
      where: { id: leaveId },
      data: { status },
    });

    // 🔥 If approved → update balance
    if (status === "APPROVED") {
      const days =
        (new Date(leave.endDate).getTime() -
          new Date(leave.startDate).getTime()) /
          (1000 * 60 * 60 * 24) +
        1;

      const balance = await prisma.leaveBalance.findUnique({
        where: { userId: leave.userId },
      });

      if (leave.type === "ANNUAL") {
        await prisma.leaveBalance.update({
          where: { userId: leave.userId },
          data: {
            annualUsed: (balance?.annualUsed || 0) + days,
          },
        });
      } else if (leave.type === "SICK") {
        await prisma.leaveBalance.update({
          where: { userId: leave.userId },
          data: {
            sickUsed: (balance?.sickUsed || 0) + days,
          },
        });
      }
    }

    res.json({ message: "Leave updated", updatedLeave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllLeaves = async (req: any, res: Response) => {
  const leaves = await prisma.leave.findMany({
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
    orderBy: { createdAt: "desc" },
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