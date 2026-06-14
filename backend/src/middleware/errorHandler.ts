import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    err.name === "PrismaClientInitializationError"
  ) {
    res.status(503).json({
      message:
        "Database connection failed. Start PostgreSQL and run npm run db:setup in the backend folder.",
    });
    return;
  }

  res.status(500).json({
    message: err.message || "Internal server error",
  });
}
