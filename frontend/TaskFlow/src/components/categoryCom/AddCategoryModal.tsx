import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { CATEGORY_COLOR_STYLES, CATEGORY_ICONS } from "@/lib/categoryUtils";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const AVAILABLE_ICONS = Object.entries(CATEGORY_ICONS).map(([id, icon]) => ({
  id,
  icon,
}));

const AVAILABLE_COLORS = Object.entries(CATEGORY_COLOR_STYLES).map(
  ([id, styles]) => ({
    id,
    value: styles.progress,
  }),
);

function AddCategoryModal({ isOpen, onClose, onCreated }: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("palette");
  const [selectedColor, setSelectedColor] = useState("dark-blue");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setCategoryName("");
    setDescription("");
    setSelectedIcon("palette");
    setSelectedColor("dark-blue");
    onClose();
  };

  const handleSave = async () => {
    if (!categoryName) return;

    setIsSubmitting(true);
    try {
      await api.categories.create({
        categoryName,
        description,
        selectedIcon,
        selectedColor,
      });
      handleReset();
      onCreated?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-130 overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="relative px-8 pt-8 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create a custom grouping to organize your team's tasks.
          </p>
          <button
            onClick={handleReset}
            className="absolute top-6 right-6 text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-8 pb-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Category Name</label>
            <Input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Marketing, QA, Research"
              className="h-11 w-full rounded-lg border-0 bg-[#f3f4f6]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the purpose of this category..."
              rows={3}
              className="w-full resize-none rounded-lg border-0 bg-[#f3f4f6] px-3 py-2 text-sm text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Select Icon</label>
            <div className="flex gap-2.5">
              {AVAILABLE_ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIcon(item.id)}
                    className={`flex h-12 w-16 items-center justify-center rounded-lg transition-all ${
                      isSelected
                        ? "bg-[#eef2ff] text-blue-700 ring-2 ring-blue-700"
                        : "bg-[#f3f4f6] text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Theme Color</label>
            <div className="flex items-center gap-3">
              {AVAILABLE_COLORS.map((color) => {
                const isSelected = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                    className={`h-8 w-8 rounded-full transition-transform ${color.value} ${
                      isSelected
                        ? "scale-110 ring-2 ring-blue-700 ring-offset-2"
                        : "hover:scale-105"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-[#f8fafc] px-8 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900"
          >
            Cancel
          </button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="h-10 rounded-lg bg-[#2563eb] px-5 font-semibold text-white hover:bg-[#1d4ed8]"
          >
            {isSubmitting ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddCategoryModal;
