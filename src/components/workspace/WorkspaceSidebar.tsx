import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Stethoscope, 
  DollarSign, 
  ArrowLeftRight, 
  FlaskConical, 
  Settings2,
  ChevronLeft,
  BarChart3
} from "lucide-react";
import SaudeLogo from "@/components/SaudeLogo";

const menuItems = [
  {
    title: "Visão Geral",
    icon: LayoutDashboard,
    path: "/workspace",
  },
  {
    title: "Dashboard Atendimento",
    icon: Stethoscope,
    path: "/workspace/atendimento",
  },
  {
    title: "Dashboard Financeiro",
    icon: DollarSign,
    path: "/workspace/financeiro",
  },
  {
    title: "Atendimento x Financeiro",
    icon: ArrowLeftRight,
    path: "/workspace/atendimento-financeiro",
  },
  {
    title: "Laboratório",
    icon: FlaskConical,
    path: "/workspace/laboratorio",
  },
  {
    title: "Dashboards Personalizados",
    icon: Settings2,
    path: "/workspace/personalizados",
  },
];

const WorkspaceSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/workspace") {
      return location.pathname === "/workspace";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 min-h-screen gradient-navy flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-accent flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-dourado-sutil" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sidebar-foreground">Workspace</h2>
            <p className="text-xs text-sidebar-foreground/60">Dashboards Analíticos</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 px-4">
            Painéis
          </span>
        </div>
        
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  "sidebar-item w-full text-left",
                  isActive(item.path) && "sidebar-item-active"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors text-sm w-full px-4 py-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar aos Módulos
        </button>
      </div>
    </aside>
  );
};

export default WorkspaceSidebar;
