import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { formatUser } from "../utils/formatters.js";
import { paramId } from "../utils/params.js";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const invitations = await prisma.taskInvitation.findMany({
      where: { inviteeId: req.userId, status: "PENDING" },
      include: {
        inviter: true,
        task: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(
      invitations.map((inv) => ({
        id: inv.id,
        invitedBy: inv.inviter.fullName,
        taskName: inv.task.taskName,
        role: inv.role,
      })),
    );
  } catch (error) {
    next(error);
  }
});

router.post("/:id/accept", async (req: AuthRequest, res, next) => {
  try {
    const invitationId = paramId(req.params.id);
    const invitation = await prisma.taskInvitation.findFirst({
      where: { id: invitationId, inviteeId: req.userId, status: "PENDING" },
    });

    if (!invitation) {
      res.status(404).json({ message: "Invitation not found" });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.taskInvitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });

      const task = await tx.task.findUnique({
        where: { id: invitation.taskId },
        select: { assignedToId: true },
      });

      if (task && !task.assignedToId) {
        await tx.task.update({
          where: { id: invitation.taskId },
          data: { assignedToId: req.userId },
        });
      }
    });

    res.json({ message: "Invitation accepted" });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/reject", async (req: AuthRequest, res, next) => {
  try {
    const invitationId = paramId(req.params.id);
    const invitation = await prisma.taskInvitation.findFirst({
      where: { id: invitationId, inviteeId: req.userId, status: "PENDING" },
    });

    if (!invitation) {
      res.status(404).json({ message: "Invitation not found" });
      return;
    }

    await prisma.taskInvitation.update({
      where: { id: invitation.id },
      data: { status: "REJECTED" },
    });

    res.json({ message: "Invitation rejected" });
  } catch (error) {
    next(error);
  }
});

export default router;

const inviteRouter = Router();
inviteRouter.use(authMiddleware);

inviteRouter.get("/search", async (req: AuthRequest, res, next) => {
  try {
    const q = (req.query.q as string) ?? "";
    const taskId = req.query.taskId as string | undefined;

    const invitedUsers = new Map<
      string,
      { status: "PENDING" | "ACCEPTED"; role: string }
    >();

    if (taskId) {
      const invitations = await prisma.taskInvitation.findMany({
        where: {
          taskId,
          task: { createdById: req.userId },
          status: { in: ["PENDING", "ACCEPTED"] },
        },
        select: { inviteeId: true, status: true, role: true },
      });

      for (const invitation of invitations) {
        invitedUsers.set(invitation.inviteeId, {
          status: invitation.status as "PENDING" | "ACCEPTED",
          role: invitation.role,
        });
      }
    }

    const users = await prisma.user.findMany({
      where: {
        id: { not: req.userId },
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
    });

    res.json(
      users.map((user) => {
        const invitation = invitedUsers.get(user.id);

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          avatar: user.initials ?? user.fullName.slice(0, 2).toUpperCase(),
          role: (invitation?.role ?? "Member") as "Member" | "Admin",
          invitationStatus: invitation?.status ?? null,
        };
      }),
    );
  } catch (error) {
    next(error);
  }
});

inviteRouter.post("/tasks/:id/invite", async (req: AuthRequest, res, next) => {
  try {
    const { userId, role = "Member" } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const taskId = paramId(req.params.id);
    const task = await prisma.task.findFirst({
      where: { id: taskId, createdById: req.userId },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const invitation = await prisma.taskInvitation.upsert({
      where: {
        taskId_inviteeId: { taskId: task.id, inviteeId: userId },
      },
      update: { status: "PENDING", role },
      create: {
        taskId: task.id,
        inviterId: req.userId!,
        inviteeId: userId,
        role,
      },
    });

    res.status(201).json({ id: invitation.id, message: "Invitation sent" });
  } catch (error) {
    next(error);
  }
});

export { inviteRouter };
