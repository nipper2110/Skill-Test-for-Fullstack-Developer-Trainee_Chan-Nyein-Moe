import type {
  Task,
  TaskStatus,
  User,
  Category,
  InviteRole,
  InvitationStatus,
} from "@prisma/client";

const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  OVERDUE: "Overdue",
  REVIEWING: "Reviewing",
  COMPLETED: "Completed",
};

const STATUS_STYLES: Record<
  TaskStatus,
  { statusColor: string; statusBgColor: string }
> = {
  PENDING: { statusColor: "text-gray-600", statusBgColor: "bg-gray-500" },
  IN_PROGRESS: {
    statusColor: "text-yellow-600",
    statusBgColor: "bg-yellow-500",
  },
  OVERDUE: { statusColor: "text-red-600", statusBgColor: "bg-red-500" },
  REVIEWING: { statusColor: "text-blue-600", statusBgColor: "bg-blue-500" },
  COMPLETED: { statusColor: "text-green-600", statusBgColor: "bg-green-500" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type TaskInvitationWithInvitee = {
  inviteeId: string;
  role: InviteRole;
  status: InvitationStatus;
  invitee: {
    id: string;
    fullName: string;
    initials: string | null;
    avatarColor: string;
  };
};

type TaskWithRelations = Task & {
  category: Category;
  assignedTo: User | null;
  createdBy: User;
  invitations?: TaskInvitationWithInvitee[];
};

function formatAssigneeList(names: string[]): string {
  if (names.length === 0) return "Unassigned";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

function getAssigneeDisplayNames(task: TaskWithRelations): string[] {
  const names: string[] = [];
  const seen = new Set<string>();

  for (const invitation of task.invitations ?? []) {
    if (!invitation.invitee || seen.has(invitation.invitee.id)) continue;

    seen.add(invitation.invitee.id);
    names.push(
      invitation.status === "PENDING"
        ? `${invitation.invitee.fullName} (invited)`
        : invitation.invitee.fullName,
    );
  }

  if (task.assignedTo && !seen.has(task.assignedTo.id)) {
    names.push(task.assignedTo.fullName);
  }

  return names;
}

function getPrimaryAssignee(
  task: TaskWithRelations,
): TaskInvitationWithInvitee["invitee"] | User | null {
  const acceptedInvitee = task.invitations?.find(
    (invitation) => invitation.status === "ACCEPTED",
  )?.invitee;

  return acceptedInvitee ?? task.invitations?.[0]?.invitee ?? task.assignedTo;
}

function canUserEditTask(
  task: TaskWithRelations,
  currentUserId?: string,
): boolean {
  if (!currentUserId) return false;
  if (task.createdById === currentUserId) return true;

  const invitation = task.invitations?.find(
    (inv) =>
      inv.inviteeId === currentUserId && inv.status === "ACCEPTED",
  );

  return invitation?.role === "Admin";
}

export function formatTask(task: TaskWithRelations, currentUserId?: string) {
  const styles = STATUS_STYLES[task.status];
  const creator = task.createdBy;
  const assigneeNames = getAssigneeDisplayNames(task);
  const primaryAssignee = getPrimaryAssignee(task);
  const isInvitedTask = Boolean(
    currentUserId && task.createdById !== currentUserId,
  );
  const displayUser = isInvitedTask ? creator : primaryAssignee;
  const canEdit = canUserEditTask(task, currentUserId);

  return {
    id: task.id,
    taskName: task.taskName,
    description: task.description ?? "",
    assignedTo: formatAssigneeList(
      assigneeNames.map((name) => name.replace(" (invited)", "")),
    ),
    assignedBy: creator.fullName,
    createdById: task.createdById,
    assignmentLabel: isInvitedTask
      ? `Assigned by ${creator.fullName}`
      : `Assigned to ${formatAssigneeList(assigneeNames)}`,
    canEdit,
    canDelete: currentUserId === task.createdById,
    avatar:
      displayUser?.initials ?? getInitials(displayUser?.fullName ?? "NA"),
    avatarColor: displayUser?.avatarColor ?? "bg-gray-400",
    category: task.category.name,
    categoryId: task.categoryId,
    status: STATUS_LABELS[task.status],
    statusRaw: task.status,
    statusColor: styles.statusColor,
    statusBgColor: styles.statusBgColor,
    dueDate: formatDate(task.dueDate),
    dueDateRaw: task.dueDate.toISOString().split("T")[0],
    tags: task.tags,
  };
}

export function formatUser(user: User) {
  return {
    id: user.id,
    fullName: user.fullName,
    title: user.title ?? "",
    email: user.email,
    initials: user.initials ?? getInitials(user.fullName),
    avatarColor: user.avatarColor,
    avatarUrl: user.avatarUrl ?? null,
  };
}

export function formatCategory(
  category: Category & { _count?: { tasks: number } },
) {
  const activeTasks = category._count?.tasks ?? 0;
  const progressValue = Math.min(100, activeTasks * 5);

  return {
    id: category.id,
    categoryName: category.name,
    description: category.description,
    selectedIcon: category.icon,
    selectedColor: category.color,
    activeTasksCount: activeTasks,
    progressValue,
  };
}

export function parseStatus(status: string): TaskStatus | null {
  const normalized = status.toLowerCase().replace(/\s+/g, "_");
  const map: Record<string, TaskStatus> = {
    pending: "PENDING",
    in_progress: "IN_PROGRESS",
    overdue: "OVERDUE",
    reviewing: "REVIEWING",
    completed: "COMPLETED",
  };
  return map[normalized] ?? null;
}
