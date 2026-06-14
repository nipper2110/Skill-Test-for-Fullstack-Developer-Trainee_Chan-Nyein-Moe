import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import AddTaskModal from "@/components/taskCom/AddTaskModal";
import TaskTable from "@/components/taskCom/TaskTable";
import { Input } from "@/components/ui/input";
import TaskCard from "@/components/taskCom/TaskCard";
import Noti from "@/components/noti";
import { api } from "@/lib/api";
import type { Category, Task } from "@/types";

function CategoryTask() {
  const { id } = useParams();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [mobileTasks, setMobileTasks] = useState<Task[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    api.categories
      .getTasks(id)
      .then((data) => {
        setCategory(data.category);
        setMobileTasks(data.tasks);
      })
      .catch(console.error);
  }, [id, refreshKey]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="min-h-screen bg-gray-100">
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onCreated={handleRefresh}
        defaultCategory={category?.categoryName ?? ""}
      />

      <div className="container mx-auto pt-8">
        <div className="mx-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">
              {category?.categoryName ?? "Category"}
            </h1>
            <p className="text-sm text-[#8E9193]">
              {category?.description ?? "Tasks in this category."}
            </p>
          </div>

          <Button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="w-full bg-[#002584] px-4 py-5 hover:bg-[#001d66] md:w-auto"
          >
            <Icons.plus />
            Add Task
          </Button>
        </div>

        <div className="container mx-auto hidden pt-8 md:block">
          <div className="mx-4 mt-4 flex flex-col gap-4 rounded-md bg-white p-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Icons.search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input type="text" placeholder="Search tasks..." className="pl-9" />
            </div>
            <Noti />
          </div>

          <TaskTable
            categoryFilter={category?.categoryName ?? ""}
            onRefresh={handleRefresh}
            key={refreshKey}
          />
        </div>

        <div className="container mx-auto block pt-8 md:hidden">
          <div className="mx-4 mt-4 space-y-4">
            {mobileTasks.map((task) => (
              <TaskCard key={task.id} task={task} onRefresh={handleRefresh} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryTask;
