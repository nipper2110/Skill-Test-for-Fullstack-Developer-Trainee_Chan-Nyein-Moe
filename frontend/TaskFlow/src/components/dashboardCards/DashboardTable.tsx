import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router";
import { api } from "@/lib/api";
import type { Task } from "@/types";
import TaskStatusBadge from "@/components/taskCom/TaskStatusBadge";

function DashboardTable() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    api.tasks.recent().then(setTasks).catch(console.error);
  }, []);

  return (
    <div className="mx-4 mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <h2 className="text-xl font-bold">Recent Tasks</h2>
        <Link to="/tasks" className="text-sm text-blue-700 hover:text-blue-800">
          View All
        </Link>
      </div>

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
            <TableHead className="pr-6 text-xs font-bold tracking-wide text-slate-500">
              DUE DATE
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-slate-500">
                No tasks yet.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow
                key={task.id}
                className="h-16 border-b hover:bg-slate-50"
              >
                <TableCell className="pl-6 text-base font-semibold text-slate-900">
                  {task.taskName}
                </TableCell>
                <TableCell className="text-base text-slate-500">
                  {task.category}
                </TableCell>
                <TableCell>
                  <TaskStatusBadge
                    status={task.status}
                    statusRaw={task.statusRaw}
                    variant="pill"
                  />
                </TableCell>
                <TableCell className="text-base text-slate-500">
                  {task.dueDate}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DashboardTable;
