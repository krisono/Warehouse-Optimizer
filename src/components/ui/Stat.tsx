import { ReactNode } from "react";

interface StatProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
}

export function Stat({ label, value, sublabel, icon, trend }: StatProps) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {sublabel}
          </p>
        )}
        {trend && (
          <p
            className={`text-xs font-medium mt-1 ${
              trend.value >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {trend.value >= 0 ? "↗" : "↘"} {Math.abs(trend.value)}%
            {trend.label && ` ${trend.label}`}
          </p>
        )}
      </div>
    </div>
  );
}
