import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Monitor, 
  Cable, 
  Link2, 
  Activity, 
  FileText, 
  Settings,
  Cpu
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/interfaciamento" },
  { icon: Monitor, label: "Equipamentos", path: "/interfaciamento/equipamentos" },
  { icon: Cable, label: "Protocolos", path: "/interfaciamento/protocolos" },
  { icon: Link2, label: "Mapeamento de Exames", path: "/interfaciamento/mapeamento" },
  { icon: Activity, label: "Monitoramento", path: "/interfaciamento/monitoramento" },
  { icon: FileText, label: "Logs de Comunicação", path: "/interfaciamento/logs" },
  { icon: Settings, label: "Configurações", path: "/interfaciamento/configuracoes" },
];

export function InterfaciamentoSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-primary min-h-screen flex flex-col">
      <div className="p-6 border-b border-primary-foreground/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
            <Cpu className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-primary-foreground font-bold text-lg">Saúde</h1>
            <p className="text-primary-foreground/70 text-sm">Interfaciamento</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/interfaciamento" && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-primary-foreground/10">
        <Link
          to="/services"
          className="flex items-center gap-3 px-4 py-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-sm">Voltar aos Módulos</span>
        </Link>
      </div>
    </aside>
  );
}
