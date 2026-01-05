import { Eye, Pencil, Trash2, Power, Copy, MoreHorizontal, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TableAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
  onDuplicate?: () => void;
  isActive?: boolean;
  showAsDropdown?: boolean;
  additionalActions?: TableAction[];
  className?: string;
}

export function TableActions({
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
  isActive = true,
  showAsDropdown = false,
  additionalActions = [],
  className,
}: TableActionsProps) {
  const actions: TableAction[] = [];

  if (onView) {
    actions.push({
      icon: Eye,
      label: "Visualizar",
      onClick: onView,
    });
  }

  if (onEdit) {
    actions.push({
      icon: Pencil,
      label: "Editar",
      onClick: onEdit,
    });
  }

  if (onDuplicate) {
    actions.push({
      icon: Copy,
      label: "Duplicar",
      onClick: onDuplicate,
    });
  }

  if (onToggleStatus) {
    actions.push({
      icon: Power,
      label: isActive ? "Inativar" : "Ativar",
      onClick: onToggleStatus,
      variant: isActive ? "destructive" : "default",
    });
  }

  if (onDelete) {
    actions.push({
      icon: Trash2,
      label: "Excluir",
      onClick: onDelete,
      variant: "destructive",
    });
  }

  actions.push(...additionalActions);

  if (showAsDropdown || actions.length > 4) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("h-8 w-8", className)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index) => (
            <div key={action.label}>
              {index > 0 && action.variant === "destructive" && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  action.variant === "destructive" && "text-destructive focus:text-destructive"
                )}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn("flex items-center gap-1", className)}>
        {actions.map((action) => (
          <Tooltip key={action.label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  "h-8 w-8",
                  action.variant === "destructive" && "text-muted-foreground hover:text-destructive"
                )}
              >
                <action.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{action.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

export default TableActions;
