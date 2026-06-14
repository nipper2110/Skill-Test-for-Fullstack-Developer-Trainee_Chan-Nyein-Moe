import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: string[];
  categoryFilter?: string;
  statusFilter?: string;
  dueDateFilter?: string;
  resultCount?: number;
  onApply: (filters: {
    category: string;
    status: string;
    dueDate: string;
  }) => void;
}

const STATUS_OPTIONS = ["Completed", "Pending", "In Progress", "Overdue"];

const DUE_DATE_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Last week", value: "lastWeek" },
  { label: "This week", value: "thisWeek" },
  { label: "Next week", value: "nextWeek" },
];

function FilterModal({
  isOpen,
  onClose,
  categories = [],
  categoryFilter = "",
  statusFilter = "",
  dueDateFilter = "",
  resultCount = 0,
  onApply,
}: FilterModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [selectedStatus, setSelectedStatus] = useState(statusFilter);
  const [selectedDueDate, setSelectedDueDate] = useState(dueDateFilter);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(categoryFilter);
      setSelectedStatus(statusFilter);
      setSelectedDueDate(dueDateFilter);
    }
  }, [isOpen, categoryFilter, statusFilter, dueDateFilter]);

  if (!isOpen) return null;

  const toggleValue = (current: string, value: string) =>
    current === value ? "" : value;

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedStatus("");
    setSelectedDueDate("");
  };

  const handleApply = () => {
    onApply({
      category: selectedCategory,
      status: selectedStatus,
      dueDate: selectedDueDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center backdrop-blur-sm md:items-center">
      <div className="max-h-[90vh] w-full rounded-t-2xl bg-white p-6 shadow-lg md:max-h-none md:w-full md:max-w-md md:rounded-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={handleReset}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Reset
          </button>
        </div>

        <div className="max-h-[calc(90vh-200px)] space-y-6 overflow-y-auto md:max-h-[calc(100vh-250px)]">
          <div>
            <label className="mb-3 block text-xs font-bold tracking-wide text-gray-600 uppercase">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-500">No categories available.</p>
              ) : (
                categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(toggleValue(selectedCategory, category))
                    }
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-200 text-blue-900"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-bold tracking-wide text-gray-600 uppercase">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setSelectedStatus(toggleValue(selectedStatus, status))
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? "bg-blue-200 text-blue-900"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-bold tracking-wide text-gray-600 uppercase">
              Due Date
            </label>
            <div className="flex flex-wrap gap-2">
              {DUE_DATE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setSelectedDueDate(toggleValue(selectedDueDate, option.value))
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedDueDate === option.value
                      ? "bg-blue-200 text-blue-900"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleApply}
            className="w-full bg-blue-900 py-6 text-white hover:bg-blue-800"
          >
            Show {resultCount} Result{resultCount !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
