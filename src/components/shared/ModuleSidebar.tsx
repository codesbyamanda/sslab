import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings,
  LogOut,
  LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  tooltip?: string;
}

export interface MenuGroup {
  label: string;
  icon?: LucideIcon;
  items: MenuItem[];
  defaultOpen?: boolean;
}

interface ModuleSidebarProps {
  moduleName: string;
  moduleSubtitle?: string;
  moduleIcon: LucideIcon;
  menuItems?: MenuItem[];
  menuGroups?: MenuGroup[];
  configPath?: string;
  showConfig?: boolean;
  collapsible?: boolean;
}

interface MenuItemComponentProps {
  item: MenuItem;
  collapsed: boolean;
  isActive: boolean;
}

const MenuItemComponent = ({ item, collapsed, isActive }: MenuItemComponentProps) => {
  const navigate = useNavigate();
  
  const content = (
    <button
      onClick={() => navigate(item.url)}
      className={cn(
        "flex items-center gap-3 py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm w-[calc(100%-16px)]",
        collapsed ? "px-3 justify-center" : "px-4",
        isActive
          ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-dourado-sutil"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span>{item.title}</span>}
    </button>
  );

  if (collapsed && item.tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="bg-card text-card-foreground border-border">
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

interface CollapsibleMenuGroupProps {
  group: MenuGroup;
  collapsed: boolean;
  location: { pathname: string };
}

const CollapsibleMenuGroupComponent = ({ group, collapsed, location }: CollapsibleMenuGroupProps) => {
  const navigate = useNavigate();
  const isGroupActive = group.items.some(item => location.pathname.startsWith(item.url));
  const [isOpen, setIsOpen] = useState(group.defaultOpen || isGroupActive);
  const GroupIcon = group.icon || Settings;

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-3 py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm w-[calc(100%-16px)] px-3 justify-center",
              isGroupActive
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <GroupIcon className="h-5 w-5 flex-shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-card text-card-foreground border-border p-0">
          <div className="py-2">
            <p className="font-medium px-3 pb-2 border-b border-border">{group.label}</p>
            <div className="pt-2">
              {group.items.map((item) => (
                <button
                  key={item.url}
                  onClick={() => navigate(item.url)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors w-full text-left",
                    location.pathname === item.url
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex items-center justify-between w-[calc(100%-16px)] py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm px-4",
          isGroupActive
            ? "bg-sidebar-accent text-sidebar-foreground"
            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <GroupIcon className="h-5 w-5 flex-shrink-0" />
          <span>{group.label}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 mt-1 space-y-0.5">
        {group.items.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
          return (
            <button
              key={item.url}
              onClick={() => navigate(item.url)}
              className={cn(
                "flex items-center gap-3 py-2 font-medium transition-all duration-150 mx-2 rounded-lg text-xs px-4 w-[calc(100%-16px)]",
                isActive
                  ? "bg-sidebar-accent/50 text-sidebar-foreground border-l-2 border-dourado-sutil"
                  : "text-sidebar-foreground/50 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground/80"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export function ModuleSidebar({
  moduleName,
  moduleSubtitle,
  moduleIcon: ModuleIcon,
  menuItems = [],
  menuGroups = [],
  configPath,
  showConfig = false,
  collapsible = true,
}: ModuleSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "h-screen gradient-navy flex flex-col transition-all duration-200 relative flex-shrink-0 sticky top-0",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Module Title */}
        <div className="p-5 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-petroleo flex items-center justify-center flex-shrink-0">
              <ModuleIcon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <span className="text-base font-semibold text-sidebar-foreground block">
                  {moduleName}
                </span>
                {moduleSubtitle && (
                  <span className="text-xs text-sidebar-foreground/60">{moduleSubtitle}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}

        {/* Navigation - Scrollable area */}
        <ScrollArea className="flex-1">
          <nav className="py-4">
            {/* Direct Menu Items */}
            {menuItems.length > 0 && (
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.url ||
                    (item.url !== "/" && location.pathname.startsWith(item.url));
                  return (
                    <li key={item.title}>
                      <MenuItemComponent item={item} collapsed={collapsed} isActive={isActive} />
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Menu Groups */}
            {menuGroups.length > 0 && menuItems.length > 0 && (
              <div className="my-4 mx-4 border-t border-sidebar-border/30" />
            )}

            {menuGroups.map((group, index) => (
              <div key={group.label}>
                {index > 0 && <div className="my-4 mx-4 border-t border-sidebar-border/30" />}
                <CollapsibleMenuGroupComponent
                  group={group}
                  collapsed={collapsed}
                  location={location}
                />
              </div>
            ))}

            {/* Config & Exit */}
            {(showConfig || configPath) && (
              <>
                <div className="my-4 mx-4 border-t border-sidebar-border/30" />
                <div className="space-y-1">
                  {configPath && (
                    <MenuItemComponent
                      item={{ title: "Configurações", url: configPath, icon: Settings }}
                      collapsed={collapsed}
                      isActive={location.pathname === configPath}
                    />
                  )}
                </div>
              </>
            )}
          </nav>
        </ScrollArea>

        {/* Footer - Exit Module */}
        <div className="p-4 border-t border-sidebar-border">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/services")}
                  className="flex items-center justify-center py-2.5 mx-2 rounded-lg text-sidebar-foreground/60 hover:text-vermelho-moderno transition-colors w-[calc(100%-16px)]"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-card text-card-foreground border-border">
                Voltar aos Módulos
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => navigate("/services")}
              className="flex items-center gap-2 text-sidebar-foreground/60 hover:text-vermelho-moderno transition-colors text-sm w-full px-4 py-2.5 rounded-lg hover:bg-sidebar-accent/30"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar aos Módulos
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

export default ModuleSidebar;
