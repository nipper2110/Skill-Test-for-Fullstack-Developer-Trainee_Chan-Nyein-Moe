import type { Prisma } from "@prisma/client";

export const taskInclude = {
  category: true,
  assignedTo: true,
  createdBy: true,
  invitations: {
    where: { status: { in: ["ACCEPTED", "PENDING"] } },
    select: {
      inviteeId: true,
      role: true,
      status: true,
      invitee: {
        select: {
          id: true,
          fullName: true,
          initials: true,
          avatarColor: true,
        },
      },
    },
  },
} satisfies Prisma.TaskInclude;
