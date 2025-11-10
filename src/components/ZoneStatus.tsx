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
        return "bg-green-100 text-green-700";
      case "Busy":
        return "bg-amber-100 text-amber-700";
      case "Normal":
        return "bg-green-100 text-green-700";
      case "Maintenance":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(zone);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-2 h-2 rounded-full ${getStatusColor(zone.status)}`}
        />
        <div>
          <p className="text-sm font-medium text-slate-900">{zone.name}</p>
          <p className="text-xs text-slate-500">
            {zone.workers} workers •{" "}
            {Math.round((zone.currentLoad / zone.capacity) * 100)}% capacity
          </p>
          <p className="text-xs text-slate-500">
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
