import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: {
    title?: string;
    description?: string;
    action?: ReactNode;
  };
}

export function Card({ children, className = "", header }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-4 md:p-6 ${className}`}
    >
      {header && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            {header.title && (
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {header.title}
              </h3>
            )}
            {header.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {header.description}
              </p>
            )}
          </div>
          {header.action && <div>{header.action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
