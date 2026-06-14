import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { OverdueTask } from "@/types";

function OverdueCard() {
  const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>([]);

  useEffect(() => {
    api.tasks.overdue().then(setOverdueTasks).catch(console.error);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-red-600">
          Overdue Tasks
        </CardTitle>
        <Icons.minus className="size-5 text-red-600" />
      </CardHeader>
      <CardContent className="space-y-4">
        {overdueTasks.length === 0 ? (
          <p className="text-sm text-gray-500">No overdue tasks.</p>
        ) : (
          overdueTasks.map((task) => (
            <div key={task.id} className="rounded-lg bg-red-50 p-4">
              <p className="font-semibold text-gray-900">{task.taskName}</p>
              <p className="text-sm font-semibold text-red-600">
                Delayed by {task.daysDelayed} day
                {task.daysDelayed !== 1 ? "s" : ""}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default OverdueCard;
