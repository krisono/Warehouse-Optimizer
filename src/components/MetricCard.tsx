import { MetricCardProps } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

export function MetricCard({ metric, className = "" }: MetricCardProps) {
  const iconColors = {
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
  };

  const getIconColor = (color: string) => {
    return iconColors[color as keyof typeof iconColors] || iconColors.blue;
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{metric.label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {metric.value}
          </p>
          <div className="flex items-center mt-2">
            {metric.trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            ) : metric.trend === "down" ? (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            ) : null}
            <span
              className={`text-sm font-medium ${
                metric.trend === "up"
                  ? "text-emerald-600"
                  : metric.trend === "down"
                  ? "text-red-600"
                  : "text-slate-600"
              }`}
            >
              {metric.change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${getIconColor(metric.color)}`}>
          <div
            className="h-8 w-8"
            dangerouslySetInnerHTML={{ __html: metric.icon }}
          />
        </div>
      </div>
    </div>
  );
}
