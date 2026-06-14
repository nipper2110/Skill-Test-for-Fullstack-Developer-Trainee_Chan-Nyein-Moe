import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export function userTasksWhere(userId: string): Prisma.TaskWhereInput {
  return {
    OR: [
      { createdById: userId },
      { assignedToId: userId },
      {
        invitations: {
          some: {
            inviteeId: userId,
            status: "ACCEPTED",
          },
        },
      },
    ],
  };
}

export function userTaskAccessWhere(
  taskId: string,
  userId: string,
): Prisma.TaskWhereInput {
  return {
    AND: [{ id: taskId }, userTasksWhere(userId)],
  };
}

export async function canUserEditTask(
  taskId: string,
  userId: string,
): Promise<boolean> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      invitations: {
        where: { inviteeId: userId, status: "ACCEPTED" },
        select: { role: true },
      },
    },
  });

  if (!task) return false;
  if (task.createdById === userId) return true;

  return task.invitations[0]?.role === "Admin";
}
