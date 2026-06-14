import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import {
  formatTask,
  parseStatus,
} from "../utils/formatters.js";
import { paramId } from "../utils/params.js";
import { userTaskAccessWhere, userTasksWhere, canUserEditTask } from "../utils/taskAccess.js";
import { applyDueDateFilter } from "../utils/dueDateFilter.js";
import { taskInclude } from "../utils/taskInclude.js";
import type { Prisma } from "@prisma/client";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const {
      search,
      category,
      status,
      sort = "dueDate",
      dueDate,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filters: Prisma.TaskWhereInput = userTasksWhere(req.userId!);

    if (search) {
      filters.taskName = { contains: search as string, mode: "insensitive" };
    }

    if (category) {
      filters.category = { name: category as string };
    }

    if (status) {
      const parsed = parseStatus(status as string);
      if (parsed) filters.status = parsed;
    }

    if (dueDate && typeof dueDate === "string") {
      applyDueDateFilter(filters, dueDate);
    }

    const orderBy: Prisma.TaskOrderByWithRelationInput =
      sort === "dueDate" ? { dueDate: "asc" } : { createdAt: "desc" };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: filters,
        include: taskInclude,
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.task.count({ where: filters }),
    ]);

    res.json({
      tasks: tasks.map((task) => formatTask(task, req.userId)),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/recent", async (req: AuthRequest, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: userTasksWhere(req.userId!),
      include: taskInclude,
      orderBy: { updatedAt: "desc" },
      take: 4,
    });

    res.json(tasks.map((task) => formatTask(task, req.userId)));
  } catch (error) {
    next(error);
  }
});

router.get("/overdue", async (req: AuthRequest, res, next) => {
  try {
    const now = new Date();
    const tasks = await prisma.task.findMany({
      where: {
        ...userTasksWhere(req.userId!),
        dueDate: { lt: now },
        status: { not: "COMPLETED" },
      },
      include: taskInclude,
      orderBy: { dueDate: "asc" },
      take: 5,
    });

    res.json(
      tasks.map((task) => {
        const daysDelayed = Math.ceil(
          (now.getTime() - task.dueDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return {
          ...formatTask(task, req.userId),
          daysDelayed,
        };
      }),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/upcoming-deadlines", async (req: AuthRequest, res, next) => {
  try {
    const now = new Date();
    const weekFromNow = new Date(now);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const tasks = await prisma.task.findMany({
      where: {
        ...userTasksWhere(req.userId!),
        dueDate: { gte: now, lte: weekFromNow },
        status: { not: "COMPLETED" },
      },
      include: taskInclude,
      orderBy: { dueDate: "asc" },
      take: 5,
    });

    res.json(
      tasks.map((task) => ({
        taskName: task.taskName,
        project: task.category.name,
        dueDate: formatTask(task, req.userId).dueDate,
      })),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: AuthRequest, res, next) => {
  try {
    const taskId = paramId(req.params.id);
    const task = await prisma.task.findFirst({
      where: userTaskAccessWhere(taskId, req.userId!),
      include: taskInclude,
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(formatTask(task, req.userId));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const { taskName, category, categoryId, status, dueDate, tags, description } =
      req.body;

    if (!taskName || !dueDate) {
      res.status(400).json({ message: "Task name and due date are required" });
      return;
    }

    let resolvedCategoryId = categoryId;

    if (!resolvedCategoryId && category) {
      const existing = await prisma.category.findFirst({
        where: { name: category, userId: req.userId },
      });

      if (existing) {
        resolvedCategoryId = existing.id;
      } else {
        const created = await prisma.category.create({
          data: {
            name: category,
            description: `${category} tasks`,
            userId: req.userId!,
          },
        });
        resolvedCategoryId = created.id;
      }
    }

    if (!resolvedCategoryId) {
      res.status(400).json({ message: "Category is required" });
      return;
    }

    const parsedStatus = status ? parseStatus(status) : "IN_PROGRESS";

    const task = await prisma.task.create({
      data: {
        taskName,
        description: description ?? "",
        status: parsedStatus ?? "IN_PROGRESS",
        dueDate: new Date(dueDate),
        tags: tags ?? [],
        categoryId: resolvedCategoryId,
        createdById: req.userId!,
        assignedToId: req.userId,
      },
      include: taskInclude,
    });

    res.status(201).json(formatTask(task, req.userId));
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req: AuthRequest, res, next) => {
  try {
    const taskId = paramId(req.params.id);
    const existing = await prisma.task.findFirst({
      where: userTaskAccessWhere(taskId, req.userId!),
    });

    if (!existing) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const allowed = await canUserEditTask(taskId, req.userId!);
    if (!allowed) {
      res.status(403).json({
        message: "You do not have permission to edit this task",
      });
      return;
    }

    const { taskName, category, status, dueDate, tags, description } = req.body;
    const updateData: Prisma.TaskUpdateInput = {};

    if (taskName) updateData.taskName = taskName;
    if (description !== undefined) updateData.description = description;
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (tags) updateData.tags = tags;

    if (status) {
      const parsed = parseStatus(status);
      if (parsed) updateData.status = parsed;
    }

    if (category) {
      const cat = await prisma.category.findFirst({
        where: { name: category, userId: req.userId },
      });
      if (cat) updateData.category = { connect: { id: cat.id } };
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: taskInclude,
    });

    res.json(formatTask(task, req.userId));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    const taskId = paramId(req.params.id);
    const existing = await prisma.task.findFirst({
      where: { id: taskId, createdById: req.userId },
    });

    if (!existing) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
