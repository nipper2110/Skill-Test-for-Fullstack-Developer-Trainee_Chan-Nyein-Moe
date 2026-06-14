import { Icons } from "@/components/icons";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Icons;
  textColor?: string;
  iconColor?: string;
  iconBgColor?: string;
  width?: string;
}

function DashboardCard({
  title,
  value,
  icon,
  textColor = "text-blue-900",
  iconColor = "text-blue-900",
  iconBgColor = "bg-blue-100",
}: DashboardCardProps) {
  const Icon = Icons[icon];

  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col">
        <p className="mb-2 text-xs font-medium text-gray-600">{title}</p>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>

      <div
        className={`flex h-16 w-16 items-center justify-center rounded-lg ${iconBgColor}`}
      >
        <Icon className={`${iconColor}`} width="24" height="24" />
      </div>
    </div>
  );
}

export default DashboardCard;
