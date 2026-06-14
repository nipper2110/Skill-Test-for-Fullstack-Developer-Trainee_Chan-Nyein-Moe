import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Task } from "@/types";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onSaved?: () => void;
}

function EditTaskModal({ isOpen, onClose, task, onSaved }: EditTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTaskName(task.taskName);
      setCategory(task.category);
      setStatus(task.status);
      setDueDate(task.dueDateRaw);
      setTags(task.tags);
      setDescription(task.description);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await api.tasks.update(task.id, {
        taskName,
        category,
        status,
        dueDate,
        tags,
        description,
      });
      onSaved?.();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-lg bg-white p-8 shadow-lg md:mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Task</h2>
            <p className="text-sm text-gray-600">
              Update task details and assignments
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              TASK NAME
            </label>
            <Input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                CATEGORY
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded border border-gray-300 px-3 text-gray-900"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900"
              >
                <option>In Progress</option>
                <option>Pending</option>
                <option>Overdue</option>
                <option>Reviewing</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                DUE DATE
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                TAGS
              </label>
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag and press Enter"
                className="w-full"
              />
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 rounded border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(index)}>✕</button>
                </span>
              ))}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;
