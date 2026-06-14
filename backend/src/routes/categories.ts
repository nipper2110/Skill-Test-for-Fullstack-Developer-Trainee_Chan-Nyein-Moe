import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { formatCategory, formatTask } from "../utils/formatters.js";
import { paramId } from "../utils/params.js";
import { userTasksWhere } from "../utils/taskAccess.js";
import { taskInclude } from "../utils/taskInclude.js";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.userId },
      include: {
        _count: {
          select: {
            tasks: {
              where: { status: { not: "COMPLETED" } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(categories.map(formatCategory));
  } catch (error) {
    next(error);
  }
});

router.get("/names", async (req: AuthRequest, res, next) => {
  try {
    const [ownCategories, taskCategories] = await Promise.all([
      prisma.category.findMany({
        where: { userId: req.userId },
        select: { name: true },
      }),
      prisma.task.findMany({
        where: userTasksWhere(req.userId!),
        select: { category: { select: { name: true } } },
      }),
    ]);

    const names = new Set([
      ...ownCategories.map((category) => category.name),
      ...taskCategories.map((task) => task.category.name),
    ]);

    res.json([...names].sort());
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const { categoryName, description, selectedIcon, selectedColor } = req.body;

    if (!categoryName) {
      res.status(400).json({ message: "Category name is required" });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name: categoryName,
        description: description ?? "",
        icon: selectedIcon ?? "palette",
        color: selectedColor ?? "dark-blue",
        userId: req.userId!,
      },
      include: {
        _count: { select: { tasks: true } },
      },
    });

    res.status(201).json(formatCategory(category));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    const categoryId = paramId(req.params.id);
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.userId },
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    await prisma.category.delete({ where: { id: categoryId } });
    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/tasks", async (req: AuthRequest, res, next) => {
  try {
    const categoryId = paramId(req.params.id);
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.userId },
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { categoryId: category.id, createdById: req.userId },
      include: taskInclude,
      orderBy: { dueDate: "asc" },
    });

    res.json({
      category: formatCategory(category),
      tasks: tasks.map((task) => formatTask(task, req.userId)),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/stats", async (req: AuthRequest, res, next) => {
  try {
    const categoryId = paramId(req.params.id);
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.userId },
      include: {
        _count: { select: { tasks: true } },
      },
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.json(formatCategory(category));
  } catch (error) {
    next(error);
  }
});

export default router;
