import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { DeadlineItem } from "@/types";

function DeadlineCard() {
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);

  useEffect(() => {
    api.tasks.upcomingDeadlines().then(setDeadlines).catch(console.error);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          Upcoming Deadlines
        </CardTitle>
        <Icons.calendar className="size-5 text-slate-600" />
      </CardHeader>
      <CardContent className="space-y-4">
        {deadlines.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming deadlines.</p>
        ) : (
          deadlines.map((item) => {
            const date = new Date(item.dueDate);
            const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
            const day = date.getDate();

            return (
              <div key={item.taskName} className="flex gap-4">
                <div className="flex flex-col items-center rounded-lg bg-blue-50 px-4 py-3">
                  <p className="text-xs font-semibold text-blue-600">{month}</p>
                  <p className="text-2xl font-bold text-blue-900">{day}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-gray-900">{item.taskName}</p>
                  <p className="text-sm text-gray-600">Project: {item.project}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export default DeadlineCard;
