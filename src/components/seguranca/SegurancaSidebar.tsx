import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  Users,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  {
    title: "Grupo de Controle de Acesso",
    icon: Users,
    path: "/seguranca/grupo-controle-acesso",
  },
  {
    title: "Perfis de Acesso",
    icon: UserCog,
    path: "/seguranca/perfil-acesso",
  },
];

export function SegurancaSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

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
              <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <span className="text-base font-semibold text-sidebar-foreground block">
                  Saúde Segurança
                </span>
                <span className="text-xs text-sidebar-foreground/60">Controle de Acesso</span>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="py-4">
            {!collapsed && (
              <p className="px-6 mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                Segurança
              </p>
            )}
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                const content = (
                  <button
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex items-center gap-3 py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm w-[calc(100%-16px)]",
                      collapsed ? "px-3 justify-center" : "px-4",
                      active
                        ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-dourado-sutil"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </button>
                );

                return (
                  <li key={item.path}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{content}</TooltipTrigger>
                        <TooltipContent side="right" className="bg-card text-card-foreground border-border">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/services")}
                  className="flex items-center justify-center py-2.5 mx-2 rounded-lg text-sidebar-foreground/60 hover:text-vermelho-moderno transition-colors w-[calc(100%-16px)]"
                >
                  <ChevronLeft className="h-5 w-5" />
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

export default SegurancaSidebar;
