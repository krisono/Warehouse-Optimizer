import { ZoneStatusProps } from "@/types";

export function ZoneStatus({ zone, onClick }: ZoneStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Optimal":
        return "bg-green-500";
      case "Busy":
        return "bg-amber-500";
      case "Normal":
        return "bg-green-500";
      case "Maintenance":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Optimal":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "Busy":
        return "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
      case "Normal":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "Maintenance":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      default:
        return "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300";
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(zone);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-2 h-2 rounded-full ${getStatusColor(zone.status)}`}
        />
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {zone.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-500">
            {zone.workers} workers •{" "}
            {Math.round((zone.currentLoad / zone.capacity) * 100)}% capacity
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-500">
            Efficiency: {zone.efficiency}%
          </p>
        </div>
      </div>
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusTextColor(
          zone.status
        )}`}
      >
        {zone.status}
      </span>
    </div>
  );
}
