export type TaskStatusKey =
  | "PENDING"
  | "IN_PROGRESS"
  | "OVERDUE"
  | "REVIEWING"
  | "COMPLETED";

const STATUS_STYLE_MAP: Record<
  TaskStatusKey,
  { statusColor: string; statusBgColor: string; badgeClass: string }
> = {
  PENDING: {
    statusColor: "text-gray-600",
    statusBgColor: "bg-gray-500",
    badgeClass: "bg-gray-100 text-gray-700",
  },
  IN_PROGRESS: {
    statusColor: "text-yellow-600",
    statusBgColor: "bg-yellow-500",
    badgeClass: "bg-yellow-100 text-yellow-700",
  },
  OVERDUE: {
    statusColor: "text-red-600",
    statusBgColor: "bg-red-500",
    badgeClass: "bg-red-100 text-red-700",
  },
  REVIEWING: {
    statusColor: "text-blue-600",
    statusBgColor: "bg-blue-500",
    badgeClass: "bg-blue-100 text-blue-700",
  },
  COMPLETED: {
    statusColor: "text-green-600",
    statusBgColor: "bg-green-500",
    badgeClass: "bg-green-100 text-green-700",
  },
};

const STATUS_LABEL_TO_KEY: Record<string, TaskStatusKey> = {
  Pending: "PENDING",
  "In Progress": "IN_PROGRESS",
  Overdue: "OVERDUE",
  Reviewing: "REVIEWING",
  Completed: "COMPLETED",
};

export function getStatusStyles(statusRaw: string, statusLabel?: string) {
  const key =
    (statusRaw as TaskStatusKey) in STATUS_STYLE_MAP
      ? (statusRaw as TaskStatusKey)
      : statusLabel
        ? STATUS_LABEL_TO_KEY[statusLabel]
        : undefined;

  return STATUS_STYLE_MAP[key ?? "PENDING"];
}
