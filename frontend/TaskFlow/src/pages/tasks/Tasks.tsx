import { useEffect, useState } from "react";
import TaskTable from "@/components/taskCom/TaskTable";
import AddTaskModal from "@/components/taskCom/AddTaskModal";
import FilterModal from "@/components/taskCom/FilterModal";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskCard from "@/components/taskCom/TaskCard";
import Noti from "@/components/noti";
import { api } from "@/lib/api";
import type { Task } from "@/types";
import { TASKS_REFRESH_EVENT } from "@/lib/taskEvents";

const DUE_DATE_FILTERS = [
  { value: "", label: "Due Date" },
  { value: "today", label: "Today" },
  { value: "lastWeek", label: "Last week" },
  { value: "thisWeek", label: "This week" },
  { value: "nextWeek", label: "Next week" },
] as const;

function Tasks() {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [mobileTasks, setMobileTasks] = useState<Task[]>([]);
  const [mobileTotal, setMobileTotal] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadCategoryOptions = () => {
    api.categories.names().then(setCategoryOptions).catch(console.error);
  };

  useEffect(() => {
    loadCategoryOptions();
  }, [refreshKey]);

  useEffect(() => {
    const params: Record<string, string> = { limit: "10" };
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    if (statusFilter) params.status = statusFilter;
    if (dueDateFilter) params.dueDate = dueDateFilter;

    api.tasks
      .list(params)
      .then((data) => {
        setMobileTasks(data.tasks);
        setMobileTotal(data.pagination.total);
      })
      .catch(console.error);
  }, [search, categoryFilter, statusFilter, dueDateFilter, refreshKey]);

  useEffect(() => {
    const handleRefresh = () => setRefreshKey((k) => k + 1);
    window.addEventListener(TASKS_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(TASKS_REFRESH_EVENT, handleRefresh);
  }, []);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  const dueDateLabel =
    DUE_DATE_FILTERS.find((option) => option.value === dueDateFilter)?.label ??
    "Due Date";

  return (
    <div className="min-h-screen bg-gray-100">
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onCreated={handleRefresh}
      />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categories={categoryOptions}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        dueDateFilter={dueDateFilter}
        resultCount={mobileTotal}
        onApply={({ category, status, dueDate }) => {
          setCategoryFilter(category);
          setStatusFilter(status);
          setDueDateFilter(dueDate);
        }}
      />

      <div className="container mx-auto hidden pt-8 md:block">
        <div className="mx-4 flex justify-between">
          <div>
            <header className="text-3xl font-semibold">Tasks</header>
            <span className="text-sm text-[#8E9193]">
              Manage and track your team's workflow efficiency.
            </span>
          </div>
          <Button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="hidden bg-[#002584] px-4 py-5 hover:bg-[#001d66] md:flex"
          >
            <Icons.plus /> Add Task
          </Button>
        </div>

        <div className="mx-4 mt-4 flex flex-col gap-4 rounded-md bg-white p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Icons.search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium">
                <Icons.stack />
                {categoryFilter || "Category"}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCategoryFilter("")}>
                  All
                </DropdownMenuItem>
                {categoryOptions.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-md border px-4 py-2 text-sm font-medium">
                {statusFilter || "Status"}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("In Progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Overdue")}>
                  Overdue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-md border px-4 py-2 text-sm font-medium">
                {dueDateLabel}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setDueDateFilter("")}>
                  All
                </DropdownMenuItem>
                {DUE_DATE_FILTERS.filter((option) => option.value).map(
                  (option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setDueDateFilter(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Noti />
          </div>
        </div>

        <TaskTable
          search={search}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          dueDateFilter={dueDateFilter}
          onRefresh={handleRefresh}
          key={refreshKey}
        />
      </div>

      <div className="container mx-auto block pt-8 md:hidden">
        <div className="mx-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <p className="mt-1 text-sm text-[#8E9193]">
              Manage and track your team's workflow efficiency.
            </p>
          </div>
          <Button
            onClick={() => setIsAddTaskModalOpen(true)}
            size="icon"
            className="shrink-0 bg-[#002584] hover:bg-[#001d66]"
          >
            <Icons.plus />
          </Button>
        </div>

        <div className="mx-4 mt-4 flex justify-between space-x-2">
          <div className="relative w-80 md:max-w-sm">
            <Icons.search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="bg-white pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="rounded-md border bg-white p-2 hover:bg-gray-50"
          >
            <Icons.filter />
          </button>
          <Noti />
        </div>

        <div className="mx-4 mt-4 space-y-4">
          {mobileTasks.length === 0 ? (
            <p className="text-center text-sm text-gray-500">No tasks found.</p>
          ) : (
            mobileTasks.map((task) => (
              <TaskCard key={task.id} task={task} onRefresh={handleRefresh} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
