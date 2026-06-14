import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { userTasksWhere } from "../utils/taskAccess.js";

const router = Router();

router.use(authMiddleware);

router.get("/stats", async (req: AuthRequest, res, next) => {
  try {
    const where = userTasksWhere(req.userId!);

    const [total, pending, inProgress, completed] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.count({ where: { ...where, status: "PENDING" } }),
      prisma.task.count({ where: { ...where, status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { ...where, status: "COMPLETED" } }),
    ]);

    res.json({ total, pending, inProgress, completed });
  } catch (error) {
    next(error);
  }
});

export default router;
