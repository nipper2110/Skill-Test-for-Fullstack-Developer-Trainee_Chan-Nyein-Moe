import { PrismaClient, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.taskInvitation.deleteMany();
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  const alex = await prisma.user.create({
    data: {
      email: "alex@taskflow.com",
      password,
      fullName: "Alex Morgan",
      title: "Product Manager",
      initials: "AM",
      avatarColor: "bg-gray-400",
    },
  });

  const john = await prisma.user.create({
    data: {
      email: "john@taskflow.com",
      password,
      fullName: "John Doe",
      title: "Backend Developer",
      initials: "JD",
      avatarColor: "bg-blue-600",
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: "sarah@taskflow.com",
      password,
      fullName: "Sarah K.",
      title: "Finance Analyst",
      initials: "SK",
      avatarColor: "bg-purple-400",
    },
  });

  const leo = await prisma.user.create({
    data: {
      email: "leo@taskflow.com",
      password,
      fullName: "Leo West",
      title: "HR Manager",
      initials: "LW",
      avatarColor: "bg-green-600",
    },
  });

  const design = await prisma.category.create({
    data: {
      name: "Design",
      description:
        "UI/UX assets, design systems, and brand guidelines for all active projects.",
      icon: "palette",
      color: "dark-blue",
      userId: alex.id,
    },
  });

  const development = await prisma.category.create({
    data: {
      name: "Development",
      description: "Engineering tasks, API work, and infrastructure.",
      icon: "code",
      color: "slate",
      userId: alex.id,
    },
  });

  const finance = await prisma.category.create({
    data: {
      name: "Finance",
      description: "Budgeting, reporting, and financial planning.",
      icon: "megaphone",
      color: "royal-blue",
      userId: alex.id,
    },
  });

  const hr = await prisma.category.create({
    data: {
      name: "HR",
      description: "Hiring, onboarding, and team operations.",
      icon: "users",
      color: "red-brown",
      userId: alex.id,
    },
  });

  const tasks = [
    {
      taskName: "Redesign Marketing Assets",
      description: "Refresh marketing collateral for Q4 campaign.",
      status: "IN_PROGRESS" as TaskStatus,
      dueDate: new Date("2023-10-24"),
      tags: ["Urgent", "Q4"],
      categoryId: design.id,
      assignedToId: alex.id,
      createdById: alex.id,
    },
    {
      taskName: "Fix Auth Middleware",
      description: "Resolve token validation edge cases.",
      status: "OVERDUE" as TaskStatus,
      dueDate: new Date("2023-10-18"),
      tags: ["Bug", "Security"],
      categoryId: development.id,
      assignedToId: john.id,
      createdById: alex.id,
    },
    {
      taskName: "Q3 Financial Reporting",
      description: "Compile and review Q3 financial reports.",
      status: "REVIEWING" as TaskStatus,
      dueDate: new Date("2023-10-30"),
      tags: ["Reports"],
      categoryId: finance.id,
      assignedToId: sarah.id,
      createdById: alex.id,
    },
    {
      taskName: "Onboard New Interns",
      description: "Prepare onboarding materials and schedule sessions.",
      status: "COMPLETED" as TaskStatus,
      dueDate: new Date("2023-10-20"),
      tags: ["Internal"],
      categoryId: hr.id,
      assignedToId: leo.id,
      createdById: alex.id,
    },
    {
      taskName: "Update Brand Guidelines",
      description: "Align brand guidelines with new visual identity.",
      status: "IN_PROGRESS" as TaskStatus,
      dueDate: new Date("2025-10-12"),
      tags: ["Design"],
      categoryId: design.id,
      assignedToId: alex.id,
      createdById: alex.id,
    },
    {
      taskName: "API Integration Layer",
      description: "Build integration layer for third-party services.",
      status: "PENDING" as TaskStatus,
      dueDate: new Date("2025-10-10"),
      tags: ["Backend"],
      categoryId: development.id,
      assignedToId: john.id,
      createdById: alex.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  const taskRecords = await prisma.task.findMany({ where: { createdById: alex.id } });

  await prisma.taskInvitation.createMany({
    data: [
      {
        taskId: taskRecords[0].id,
        inviterId: alex.id,
        inviteeId: john.id,
      },
      {
        taskId: taskRecords[1].id,
        inviterId: john.id,
        inviteeId: alex.id,
      },
      {
        taskId: taskRecords[2].id,
        inviterId: sarah.id,
        inviteeId: alex.id,
      },
    ],
  });

  console.log("Seed completed.");
  console.log("Demo login: alex@taskflow.com / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
