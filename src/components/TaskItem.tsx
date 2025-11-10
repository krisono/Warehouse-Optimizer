import { TaskItemProps } from "@/types";

export function TaskItem({ task, onAssign }: TaskItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-amber-100 text-amber-700";
      case "Medium":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      default:
        return "bg-green-500";
    }
  };

  const handleAssign = () => {
    if (onAssign) {
      onAssign(task.id);
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-3 h-3 rounded-full ${getUrgencyColor(task.urgency)}`}
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-slate-900">{task.id}</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
              {task.status !== "pending" && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-700"
                      : task.status === "delayed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1">{task.product}</p>
            <p className="text-xs text-slate-500">{task.location}</p>
            {task.assignedWorker && (
              <p className="text-xs text-blue-600 mt-1">
                Assigned to: {task.assignedWorker}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-xs text-slate-500">SLA Time</p>
            <p className="font-medium text-slate-900">{task.sla}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Revenue</p>
            <p className="font-medium text-emerald-600">{task.revenue}</p>
          </div>
          {task.status === "pending" && (
            <button
              onClick={handleAssign}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Assign
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
