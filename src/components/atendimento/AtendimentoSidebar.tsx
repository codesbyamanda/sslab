import { 
  Activity, 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  UserCog, 
  FileBarChart, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  User,
  Package,
  Calculator,
  FileText,
  Wallet,
  Receipt,
  ArrowLeftRight,
  Calendar,
  Building2,
  TrendingDown,
  Clock,
  AlertCircle,
  CreditCard
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SubMenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ElementType;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/atendimento", icon: LayoutDashboard },
  { 
    title: "Atendimentos", 
    icon: ClipboardList,
    subItems: [
      { title: "Paciente", url: "/atendimento/paciente", icon: User },
      { title: "Atendimento", url: "/atendimento/atendimentos", icon: ClipboardList },
      { title: "Recebimento de Material", url: "/atendimento/recebimento", icon: Package },
      { title: "Orçamento", url: "/atendimento/orcamento", icon: Calculator },
      { title: "Profissionais de Saúde", url: "/atendimento/profissionais", icon: UserCog },
      { title: "Impressão de Laudos", url: "/atendimento/laudos", icon: FileText },
    ]
  },
  { 
    title: "Financeiro", 
    icon: Wallet,
    subItems: [
      { title: "Caixa", url: "/atendimento/caixa", icon: Wallet },
      { title: "Registros de Caixa", url: "/atendimento/registros-caixa", icon: Receipt },
      { title: "Transferência de Caixa", url: "/atendimento/transferencia-caixa", icon: ArrowLeftRight },
    ]
  },
  { 
    title: "Relatórios", 
    icon: FileBarChart,
    subItems: [
      { title: "Atendimento Diário", url: "/atendimento/relatorios/diario", icon: Calendar },
      { title: "Atendimento por Convênio", url: "/atendimento/relatorios/convenio", icon: Building2 },
      { title: "Atendimento Particular", url: "/atendimento/relatorios/particular", icon: Users },
      { title: "Movimentação Financeira", url: "/atendimento/relatorios/financeiro", icon: TrendingDown },
      { title: "Devedores", url: "/atendimento/relatorios/devedores", icon: AlertCircle },
      { title: "Promessa de Entrega", url: "/atendimento/relatorios/promessa", icon: Clock },
      { title: "Itens Pendentes", url: "/atendimento/relatorios/pendentes", icon: ClipboardList },
      { title: "Faturamentos", url: "/atendimento/relatorios/faturamentos", icon: CreditCard },
    ]
  },
  { title: "Configurações", url: "/atendimento/configuracoes", icon: Settings },
];

const AtendimentoSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Atendimentos"]);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const isSubItemActive = (subItems?: SubMenuItem[]) => {
    if (!subItems) return false;
    return subItems.some(item => location.pathname === item.url);
  };

  return (
    <aside className={cn(
      "fixed top-0 left-0 h-screen gradient-navy flex flex-col transition-all duration-200 z-40 flex-shrink-0",
      collapsed ? "w-20" : "w-64"
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
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.includes(item.title);
            const isActive = item.url ? location.pathname === item.url : isSubItemActive(item.subItems);
            
            return (
              <li key={item.title}>
                {hasSubItems ? (
                  <>
                    <button
                      onClick={() => !collapsed && toggleMenu(item.title)}
                      className={cn(
                        "flex items-center justify-between w-full py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm",
                        collapsed ? "px-3" : "px-4",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                      style={{ width: collapsed ? "calc(100% - 16px)" : "calc(100% - 16px)" }}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isExpanded ? "rotate-180" : ""
                        )} />
                      )}
                    </button>
                    
                    {/* Sub Items */}
                    {!collapsed && isExpanded && (
                      <ul className="mt-1 ml-4 space-y-0.5 animate-fade-in">
                        {item.subItems?.map((subItem) => {
                          const isSubActive = location.pathname === subItem.url;
                          return (
                            <li key={subItem.title}>
                              <NavLink
                                to={subItem.url}
                                className={cn(
                                  "flex items-center gap-2.5 py-2 px-4 mx-2 rounded-lg text-xs font-medium transition-all duration-150",
                                  isSubActive
                                    ? "bg-petroleo/20 text-sidebar-foreground border-l-2 border-dourado-sutil"
                                    : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                )}
                              >
                                <subItem.icon className="h-4 w-4 flex-shrink-0" />
                                <span>{subItem.title}</span>
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.url || "#"}
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
                )}
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