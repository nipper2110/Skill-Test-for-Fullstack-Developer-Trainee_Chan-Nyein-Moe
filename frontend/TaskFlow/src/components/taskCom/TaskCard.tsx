import { useState } from "react";
import { Button } from "@/components/ui/button";
import InviteModal from "./InviteModal";
import EditTaskModal from "./EditTaskModal";
import TaskStatusBadge from "./TaskStatusBadge";
import { Icons } from "@/components/icons";
import { api } from "@/lib/api";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onRefresh?: () => void;
}

function TaskCard({ task, onRefresh }: TaskCardProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.tasks.delete(task.id);
      onRefresh?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        task={task}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
        onSaved={onRefresh}
      />

      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="text-xs font-bold tracking-wide text-blue-600">
            {task.category.toUpperCase()}
          </span>
          <div className="flex items-center gap-2">
            <TaskStatusBadge status={task.status} statusRaw={task.statusRaw} />
            {task.canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${task.taskName}`}
              >
                <Icons.delete className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <h2 className="mb-4 text-xl font-bold text-gray-900">{task.taskName}</h2>

        <div className="mb-6 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${task.avatarColor}`}
          >
            {task.avatar}
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-900">
              {task.assignmentLabel}
            </p>
            <p className="text-xs text-gray-600">{task.dueDate}</p>
          </div>
        </div>

        <div className="flex gap-3">
          {task.canEdit && (
            <Button
              onClick={() => setIsEditModalOpen(true)}
              variant="outline"
              className="flex-1 text-gray-600 hover:text-gray-900"
            >
              Edit
            </Button>
          )}
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Invite
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
