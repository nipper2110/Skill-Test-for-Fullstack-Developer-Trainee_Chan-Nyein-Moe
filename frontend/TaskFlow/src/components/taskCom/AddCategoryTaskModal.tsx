import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddCategoryTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddCategoryTaskModal({ isOpen, onClose }: AddCategoryTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log({
      taskName,
      category,
      status,
      dueDate,
      tags,
      description,
    });
    // Reset form
    setTaskName("");
    setCategory("");
    setStatus("In Progress");
    setDueDate("");
    setTags([]);
    setDescription("");
    setTagInput("");
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setTaskName("");
    setCategory("");
    setStatus("In Progress");
    setDueDate("");
    setTags([]);
    setDescription("");
    setTagInput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-lg bg-white p-8 shadow-lg md:mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Task
            </h2>
            <p className="text-sm text-gray-600">
              Add a new task and assign it to team members
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-6">
          {/* Task Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              TASK NAME
            </label>
            <Input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              className="w-full"
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                CATEGORY
              </label>
              <input
                type="text"
                placeholder="Design"
                disabled
                className="h-10 w-full rounded border border-gray-300 bg-gray-100 px-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 hover:border-gray-400"
              >
                <option>In Progress</option>
                <option>Overdue</option>
                <option>Reviewing</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date and Tags */}
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

          {/* Tags Display */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 rounded border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(index)}
                    className="hover:text-blue-900"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add task description..."
              rows={4}
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 hover:border-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            Create Task
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddCategoryTaskModal;
