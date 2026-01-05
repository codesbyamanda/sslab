import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-verde-clinico/10 text-verde-clinico",
        warning: "border-transparent bg-ambar-suave/10 text-ambar-suave",
        error: "border-transparent bg-vermelho-moderno/10 text-vermelho-moderno",
        neutral: "border-transparent bg-muted text-muted-foreground",
        active: "border-transparent bg-verde-clinico/10 text-verde-clinico",
        inactive: "border-transparent bg-muted text-muted-foreground",
        pending: "border-transparent bg-ambar-suave/10 text-ambar-suave",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
