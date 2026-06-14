import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import AddCategoryModal from "@/components/categoryCom/AddCategoryModal";
import CategoryCards from "@/components/categoryCom/CategoryCards";
import { Link } from "react-router";
import { api } from "@/lib/api";
import type { Category } from "@/types";

function Categories() {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = () => {
    api.categories.list().then(setCategories).catch(console.error);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement>,
    category: Category,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!confirm(`Delete "${category.categoryName}" and its tasks?`)) return;

    try {
      await api.categories.delete(category.id);
      loadCategories();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onCreated={loadCategories}
      />

      <div className="container mx-auto pt-8">
        <div className="mx-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">Categories</h1>
            <p className="text-sm text-[#8E9193]">
              Organize your workspace with custom logical groupings.
            </p>
          </div>

          <Button
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="w-full bg-[#002584] px-4 py-5 hover:bg-[#001d66] md:w-auto"
          >
            <Icons.plus />
            Add Category
          </Button>
        </div>

        <div className="mx-4 mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {categories.length === 0 ? (
            <p className="text-gray-500">
              No categories yet. Create one to get started.
            </p>
          ) : (
            categories.map((category) => (
              <Link key={category.id} to={`/categoryTask/${category.id}`}>
                <CategoryCards
                  title={category.categoryName}
                  description={category.description}
                  activeTasksCount={category.activeTasksCount}
                  selectedIcon={category.selectedIcon}
                  selectedColor={category.selectedColor}
                  progressValue={category.progressValue}
                  onDelete={(event) => handleDelete(event, category)}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;
