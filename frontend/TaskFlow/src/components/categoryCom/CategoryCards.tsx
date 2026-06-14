import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import {
  getCategoryColorStyles,
  getCategoryIcon,
} from "@/lib/categoryUtils";

interface CategoryCardProps {
  title: string;
  description: string;
  activeTasksCount: number;
  selectedIcon?: string;
  selectedColor?: string;
  progressValue?: number;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function CategoryCard({
  title,
  description,
  activeTasksCount,
  selectedIcon = "palette",
  selectedColor = "dark-blue",
  progressValue = 0,
  onDelete,
}: CategoryCardProps) {
  const Icon = getCategoryIcon(selectedIcon);
  const colors = getCategoryColorStyles(selectedColor);

  return (
    <Card className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg} ${colors.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${title} category`}
          >
            <Icons.delete className="h-4 w-4" />
          </button>
        )}
      </div>

      <CardHeader className="mt-5 p-0">
        <CardTitle className="text-xl font-bold tracking-tight text-gray-900">
          {title}
        </CardTitle>
        <CardDescription className="mt-2 line-clamp-2 h-10 text-sm leading-relaxed text-gray-500">
          {description}
        </CardDescription>
      </CardHeader>

      <hr className="my-5 border-gray-100" />

      <CardContent className="flex items-center justify-between p-0">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${colors.badgeBg} ${colors.badgeText}`}
        >
          {activeTasksCount} Active Tasks
        </span>

        <div className="h-2.5 w-16 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${colors.progress}`}
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default CategoryCard;
