import { 
  Activity, 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  UserCog, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Package,
  Calculator,
  Printer,
  Wallet,
  BarChart3,
  CreditCard,
  ArrowLeftRight,
  FileBarChart,
  Calendar,
  Building2,
  UserCheck,
  TrendingDown,
  Clock,
  AlertCircle,
  Receipt
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
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

const mainMenuItems = [
  { 
    title: "Dashboard", 
    url: "/atendimento", 
    icon: LayoutDashboard,
    tooltip: "Visão geral do módulo de atendimento"
  },
  { 
    title: "Paciente", 
    url: "/atendimento/pacientes", 
    icon: Users,
    tooltip: "Cadastro do paciente (fichário / prontuário)"
  },
  { 
    title: "Atendimento", 
    url: "/atendimento/requisicoes", 
    icon: ClipboardList,
    tooltip: "Gerar requisições a partir de solicitações médicas"
  },
  { 
    title: "Recebimento de Material", 
    url: "/atendimento/recebimento", 
    icon: Package,
    tooltip: "Recebimento de amostras de exames pendentes"
  },
  { 
    title: "Orçamento", 
    url: "/atendimento/orcamento", 
    icon: Calculator,
    tooltip: "Realizar orçamentos com base nos convênios cadastrados"
  },
  { 
    title: "Profissional da Saúde", 
    url: "/atendimento/profissionais", 
    icon: UserCog,
    tooltip: "Cadastro de profissionais solicitantes (CRM, Crefito, COREN etc.)"
  },
  { 
    title: "Impressão de Laudo", 
    url: "/atendimento/laudos", 
    icon: Printer,
    tooltip: "Impressão e geração de laudos individuais por paciente"
  },
];

const financeiroItems = [
  { title: "Caixa", url: "/atendimento/financeiro/caixa", icon: Wallet },
  { title: "Registros de Caixa", url: "/atendimento/financeiro/registros", icon: CreditCard },
  { title: "Transferência de Caixa", url: "/atendimento/financeiro/transferencia", icon: ArrowLeftRight },
];

const relatoriosItems = [
  { title: "Atendimento Diário", url: "/atendimento/relatorios/diario", icon: Calendar },
  { title: "Atendimento por Convênio", url: "/atendimento/relatorios/convenio", icon: Building2 },
  { title: "Atendimento Particular", url: "/atendimento/relatorios/particular", icon: UserCheck },
  { title: "Movimentação Financeira", url: "/atendimento/relatorios/financeiro", icon: TrendingDown },
  { title: "Devedores", url: "/atendimento/relatorios/devedores", icon: AlertCircle },
  { title: "Promessa de Entrega", url: "/atendimento/relatorios/promessa", icon: Clock },
  { title: "Itens Pendentes", url: "/atendimento/relatorios/pendentes", icon: FileText },
  { title: "Faturamentos", url: "/atendimento/relatorios/faturamentos", icon: Receipt },
];

interface MenuItemProps {
  item: { title: string; url: string; icon: React.ComponentType<{ className?: string }>; tooltip?: string };
  collapsed: boolean;
  isActive: boolean;
}

const MenuItem = ({ item, collapsed, isActive }: MenuItemProps) => {
  const content = (
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
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[];
  collapsed: boolean;
  location: { pathname: string };
}

const CollapsibleMenuGroup = ({ title, icon: Icon, items, collapsed, location }: CollapsibleMenuGroupProps) => {
  const isGroupActive = items.some(item => location.pathname.startsWith(item.url));
  const [isOpen, setIsOpen] = useState(isGroupActive);

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
            <Icon className="h-5 w-5 flex-shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-card text-card-foreground border-border p-0">
          <div className="py-2">
            <p className="font-medium px-3 pb-2 border-b border-border">{title}</p>
            <div className="pt-2">
              {items.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
                    location.pathname === item.url
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
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
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span>{title}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 mt-1 space-y-0.5">
        {items.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 py-2 font-medium transition-all duration-150 mx-2 rounded-lg text-xs px-4",
                isActive
                  ? "bg-sidebar-accent/50 text-sidebar-foreground border-l-2 border-dourado-sutil"
                  : "text-sidebar-foreground/50 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground/80"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

const AtendimentoSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "h-screen gradient-navy flex flex-col transition-all duration-200 relative flex-shrink-0 sticky top-0",
        collapsed ? "w-20" : "w-64"
      )}>
        {/* Module Title */}
        <div className="p-5 border-b border-sidebar-border flex-shrink-0">
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

        {/* Navigation - Scrollable area */}
        <ScrollArea className="flex-1">
          <nav className="py-4">
            {/* Main Menu Items */}
            <ul className="space-y-1">
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url === "/atendimento" && location.pathname === "/atendimento");
                return (
                  <li key={item.title}>
                    <MenuItem item={item} collapsed={collapsed} isActive={isActive} />
                  </li>
                );
              })}
            </ul>

            {/* Separator */}
            <div className="my-4 mx-4 border-t border-sidebar-border/30" />

            {/* Financeiro Group */}
            <div className="space-y-1">
              <CollapsibleMenuGroup
                title="Financeiro"
                icon={BarChart3}
                items={financeiroItems}
                collapsed={collapsed}
                location={location}
              />
            </div>

            {/* Separator */}
            <div className="my-4 mx-4 border-t border-sidebar-border/30" />

            {/* Relatórios Group */}
            <div className="space-y-1">
              <CollapsibleMenuGroup
                title="Relatórios"
                icon={FileBarChart}
                items={relatoriosItems}
                collapsed={collapsed}
                location={location}
              />
            </div>

            {/* Separator */}
            <div className="my-4 mx-4 border-t border-sidebar-border/30" />

            {/* Geral Group */}
            <div className="space-y-1">
              {!collapsed ? (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger
                    className="flex items-center justify-between w-[calc(100%-16px)] py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm px-4 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 flex-shrink-0" />
                      <span>Geral</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 mt-1 space-y-0.5">
                    <NavLink
                      to="/atendimento/configuracoes"
                      className={cn(
                        "flex items-center gap-3 py-2 font-medium transition-all duration-150 mx-2 rounded-lg text-xs px-4",
                        location.pathname === "/atendimento/configuracoes"
                          ? "bg-sidebar-accent/50 text-sidebar-foreground border-l-2 border-dourado-sutil"
                          : "text-sidebar-foreground/50 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground/80"
                      )}
                    >
                      <Settings className="h-4 w-4 flex-shrink-0" />
                      <span>Configurações</span>
                    </NavLink>
                    <button
                      onClick={() => navigate("/services")}
                      className="flex items-center gap-3 py-2 font-medium transition-all duration-150 mx-2 rounded-lg text-xs px-4 text-sidebar-foreground/50 hover:text-vermelho-moderno w-full text-left"
                    >
                      <LogOut className="h-4 w-4 flex-shrink-0" />
                      <span>Sair do Módulo</span>
                    </button>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to="/atendimento/configuracoes"
                        className={cn(
                          "flex items-center gap-3 py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm px-3 justify-center",
                          location.pathname === "/atendimento/configuracoes"
                            ? "bg-sidebar-accent text-sidebar-foreground"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        <Settings className="h-5 w-5 flex-shrink-0" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-card text-card-foreground border-border">
                      Configurações
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => navigate("/services")}
                        className="flex items-center gap-3 py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm px-3 justify-center text-sidebar-foreground/60 hover:text-vermelho-moderno w-[calc(100%-16px)]"
                      >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-card text-card-foreground border-border">
                      Sair do Módulo
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </nav>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  );
};

export default AtendimentoSidebar;
