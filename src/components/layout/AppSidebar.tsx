import { Activity, LayoutDashboard, Users, FileText, FlaskConical, Calendar, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Pacientes", url: "/pacientes", icon: Users },
  { title: "Exames", url: "/exames", icon: FlaskConical },
  { title: "Laudos", url: "/laudos", icon: FileText },
  { title: "Agenda", url: "/agenda", icon: Calendar },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={cn(
      "min-h-screen gradient-navy flex flex-col transition-all duration-200 relative",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-petroleo flex items-center justify-center flex-shrink-0">
          <Activity className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-xl font-bold text-primary-foreground italic animate-fade-in">
            Saúde Systems
          </span>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 py-3 font-medium transition-all duration-150 mx-3 rounded-lg",
                    collapsed ? "px-3 justify-center" : "px-4",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-dourado-sutil"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="animate-fade-in">{item.title}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to="/"
          className={cn(
            "flex items-center gap-3 py-3 font-medium text-sidebar-foreground/70 hover:text-vermelho-moderno transition-colors w-full rounded-lg",
            collapsed ? "px-3 justify-center" : "px-4"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default AppSidebar;
