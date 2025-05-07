
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
  icon,
  trend,
  trendLabel,
  variant = "default",
  footer,
  className,
}: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ variant }), className)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="stat-label">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="stat-value mb-2">{value}</div>
      
      {(trend !== undefined || trendLabel) && (
        <div className="flex items-center mt-1">
          {trend !== undefined && (
            <span className={
              trend > 0 
                ? "text-green-600 text-sm font-medium" 
                : trend < 0 
                  ? "text-red-600 text-sm font-medium"
                  : "text-muted-foreground text-sm"
            }>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          )}
          {trendLabel && (
            <span className="text-muted-foreground text-sm ml-1">{trendLabel}</span>
          )}
        </div>
      )}
      
      {footer && (
        <div className="mt-4 pt-3 border-t text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
