import { getStatusStyles } from "@/lib/statusUtils";

interface TaskStatusBadgeProps {
  status: string;
  statusRaw: string;
  variant?: "dot" | "pill";
}

function TaskStatusBadge({
  status,
  statusRaw,
  variant = "dot",
}: TaskStatusBadgeProps) {
  const styles = getStatusStyles(statusRaw, status);

  if (variant === "pill") {
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles.badgeClass}`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${styles.statusBgColor}`} />
      <span className={`text-xs font-semibold ${styles.statusColor}`}>
        {status}
      </span>
    </div>
  );
}

export default TaskStatusBadge;
