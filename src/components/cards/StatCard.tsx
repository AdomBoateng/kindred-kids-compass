import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const statCardVariants = cva(
  "stat-card transition-shadow hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-primary/10",
        outline: "border-2",
        purple: "border-primary/20 bg-purple-50",
        success: "border-green-200 bg-green-50",
        warning: "border-yellow-200 bg-yellow-50",
        danger: "border-red-200 bg-red-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "outline" | "purple" | "success" | "warning" | "danger";
  footer?: ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  trend,
  trendLabel,
  variant,
  footer,
}: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ variant }), "p-6 rounded-xl border")}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{title}</span>
        {trend !== undefined && (
          <span
            className={cn(
              "text-xs font-semibold",
              trend > 0
                ? "text-green-600"
                : trend < 0
                ? "text-red-600"
                : "text-muted-foreground"
            )}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color: "#040273" }}>
        {value}
      </div>
      {trendLabel && (
        <div className="text-xs text-muted-foreground mb-2">{trendLabel}</div>
      )}
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
