import { Activity, LayoutDashboard, ClipboardList, Users, UserCog, FileBarChart, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/atendimento", icon: LayoutDashboard },
  { title: "Hub de Atendimento", url: "/atendimento/hub", icon: Activity },
  { title: "Atendimentos", url: "/atendimento/atendimentos", icon: ClipboardList },
  { title: "Pacientes", url: "/atendimento/pacientes", icon: Users },
  { title: "Profissionais", url: "/atendimento/profissionais", icon: UserCog },
  { title: "Relatórios", url: "/atendimento/relatorios", icon: FileBarChart },
  { title: "Configurações", url: "/atendimento/configuracoes", icon: Settings },
];

const AtendimentoSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className={cn(
      "fixed top-0 left-0 h-screen gradient-navy flex flex-col transition-all duration-200 z-40 flex-shrink-0",
      collapsed ? "w-20" : "w-60"
    )}>
      {/* Module Title */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-petroleo flex items-center justify-center flex-shrink-0">
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-sidebar-foreground animate-fade-in">
              Saúde Atendimento
            </span>
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
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url || (item.url === "/atendimento" && location.pathname === "/atendimento");
            return (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm",
                    collapsed ? "px-3 justify-center" : "px-4",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-dourado-sutil"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => navigate("/services")}
          className={cn(
            "flex items-center gap-3 py-2.5 font-medium text-sidebar-foreground/60 hover:text-vermelho-moderno transition-colors w-full rounded-lg text-sm",
            collapsed ? "px-3 justify-center" : "px-4"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sair do Módulo</span>}
        </button>
      </div>
    </aside>
  );
};

export default AtendimentoSidebar;
