import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InviteModal from "./InviteModal";
import EditTaskModal from "./EditTaskModal";
import TaskStatusBadge from "./TaskStatusBadge";
import { Icons } from "../icons";
import { api } from "@/lib/api";
import type { Pagination, Task } from "@/types";
import { TASKS_REFRESH_EVENT } from "@/lib/taskEvents";

interface TaskTableProps {
  search?: string;
  categoryFilter?: string;
  statusFilter?: string;
  dueDateFilter?: string;
  onRefresh?: () => void;
}

function TaskTable({
  search = "",
  categoryFilter = "",
  statusFilter = "",
  dueDateFilter = "",
  onRefresh,
}: TaskTableProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);

  const fetchTasks = useCallback(async () => {
    const params: Record<string, string> = {
      page: String(page),
      limit: "5",
    };
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    if (statusFilter) params.status = statusFilter;
    if (dueDateFilter) params.dueDate = dueDateFilter;

    const data = await api.tasks.list(params);
    setTasks(data.tasks);
    setPagination(data.pagination);
  }, [page, search, categoryFilter, statusFilter, dueDateFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter, dueDateFilter]);

  useEffect(() => {
    fetchTasks().catch(console.error);
  }, [fetchTasks]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchTasks().catch(console.error);
      onRefresh?.();
    };
    window.addEventListener(TASKS_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(TASKS_REFRESH_EVENT, handleRefresh);
  }, [fetchTasks, onRefresh]);

  const handleDelete = async (task: Task) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    await api.tasks.delete(task.id);
    await fetchTasks();
    onRefresh?.();
  };

  const handleTaskUpdated = async () => {
    await fetchTasks();
    onRefresh?.();
  };

  const start = pagination.total === 0 ? 0 : (page - 1) * pagination.limit + 1;
  const end = Math.min(page * pagination.limit, pagination.total);

  return (
    <div className="mx-4 mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        task={selectedTask}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask ?? undefined}
        onSaved={handleTaskUpdated}
      />

      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="h-12 pl-6 text-xs font-bold tracking-wide text-slate-500">
              TASK NAME
            </TableHead>
            <TableHead className="text-xs font-bold tracking-wide text-slate-500">
              CATEGORY
            </TableHead>
            <TableHead className="text-xs font-bold tracking-wide text-slate-500">
              STATUS
            </TableHead>
            <TableHead className="text-xs font-bold tracking-wide text-slate-500">
              DUE DATE
            </TableHead>
            <TableHead className="text-xs font-bold tracking-wide text-slate-500">
              TAGS
            </TableHead>
            <TableHead className="pr-6 text-xs font-bold tracking-wide text-slate-500">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow
                key={task.id}
                className="h-auto border-b hover:bg-slate-50"
              >
                <TableCell className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${task.avatarColor}`}
                    >
                      {task.avatar}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-slate-900">
                        {task.taskName}
                      </p>
                    <p className="text-xs text-slate-500">
                      {task.assignmentLabel}
                    </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {task.category}
                  </span>
                </TableCell>
                <TableCell>
                  <TaskStatusBadge
                    status={task.status}
                    statusRaw={task.statusRaw}
                  />
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {task.dueDate}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded border border-gray-200 bg-white px-2 py-1 text-xs text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center gap-2">
                    {task.canEdit && (
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setIsEditModalOpen(true);
                        }}
                        className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsInviteModalOpen(true);
                      }}
                    >
                      Invite
                    </button>
                    {task.canDelete && (
                      <button
                        onClick={() => handleDelete(task)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Icons.delete className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t px-6 py-4">
        <p className="text-sm text-slate-600">
          Showing {start}-{end} of {pagination.total} tasks
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            ‹
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .slice(0, 3)
            .map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`flex h-8 w-8 items-center justify-center rounded border ${
                  page === pageNum
                    ? "bg-blue-900 font-semibold text-white"
                    : "border-gray-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            ))}
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskTable;
