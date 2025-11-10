import { SystemService } from "@/types";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface SystemHealthProps {
  services: SystemService[];
}

export function SystemHealth({ services }: SystemHealthProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600";
      case "warning":
        return "text-amber-600";
      case "offline":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">System Health</h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-700">{service.name}</span>
                <p className="text-xs text-slate-500">
                  Uptime: {service.uptime} • Last check:{" "}
                  {service.lastChecked.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(service.status)}
                <span
                  className={`text-xs font-medium ${getStatusTextColor(
                    service.status
                  )}`}
                >
                  {service.status.charAt(0).toUpperCase() +
                    service.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
