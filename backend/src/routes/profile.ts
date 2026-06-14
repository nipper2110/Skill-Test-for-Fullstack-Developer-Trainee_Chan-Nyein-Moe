import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { formatUser } from "../utils/formatters.js";
import { validateAvatarUrl } from "../utils/avatar.js";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(formatUser(user));
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req: AuthRequest, res, next) => {
  try {
    const { fullName, title, email, avatarUrl } = req.body;

    const updateData: {
      fullName?: string;
      title?: string;
      email?: string;
      avatarUrl?: string | null;
    } = {};

    if (fullName) updateData.fullName = fullName;
    if (title !== undefined) updateData.title = title;
    if (email) updateData.email = email;

    if (avatarUrl !== undefined) {
      if (avatarUrl === null || avatarUrl === "") {
        updateData.avatarUrl = null;
      } else {
        const avatarError = validateAvatarUrl(avatarUrl);
        if (avatarError) {
          res.status(400).json({ message: avatarError });
          return;
        }
        updateData.avatarUrl = avatarUrl;
      }
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
    });

    res.json(formatUser(user));
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await prisma.user.delete({ where: { id: req.userId } });

    res.json({ message: "Account deleted successfully." });
  } catch (error) {
    next(error);
  }
});

export default router;
