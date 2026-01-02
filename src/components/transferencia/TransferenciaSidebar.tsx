import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  History, 
  FileText, 
  Settings,
  ArrowLeft,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/transferencia"
  },
  {
    title: "Transferências",
    icon: ArrowLeftRight,
    path: "/transferencia/lista"
  },
  {
    title: "Histórico",
    icon: History,
    path: "/transferencia/historico"
  },
  {
    title: "Relatórios",
    icon: FileText,
    path: "/transferencia/relatorios"
  },
  {
    title: "Configurações",
    icon: Settings,
    path: "/transferencia/configuracoes"
  }
];

const TransferenciaSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/transferencia") {
      return location.pathname === "/transferencia";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col min-h-screen">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-semibold text-foreground text-sm">Saúde</h1>
            <p className="text-xs text-muted-foreground">Transferência</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => navigate("/services")}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Módulos
        </Button>
      </div>
    </aside>
  );
};

export default TransferenciaSidebar;
