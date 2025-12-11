import { 
  DollarSign, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  FileBarChart,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  Receipt,
  FileCheck,
  Landmark,
  Building2,
  HandCoins,
  BadgeDollarSign,
  Banknote,
  CircleDollarSign,
  ArrowRightLeft
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

const recebimentosItems = [
  { title: "Receitas a Receber", url: "/financeiro/receitas", icon: Receipt },
  { title: "Cheques", url: "/financeiro/cheques", icon: FileCheck },
  { title: "Transação Cartão", url: "/financeiro/transacoes-cartao", icon: CreditCard },
  { title: "Depósitos", url: "/financeiro/depositos", icon: Landmark },
  { title: "Repasse Cartão", url: "/financeiro/repasse-cartao", icon: HandCoins },
];

const pagamentosItems = [
  { title: "Contas a Pagar", url: "/financeiro/contas-pagar", icon: BadgeDollarSign },
  { title: "Cheques Emitidos", url: "/financeiro/cheques-emitidos", icon: Banknote },
];

const fluxosItems = [
  { title: "Caixas", url: "/financeiro/caixas", icon: Wallet },
  { title: "Contas Correntes", url: "/financeiro/contas-correntes", icon: Building2 },
  { title: "Transferências entre Caixas", url: "/financeiro/transferencias-caixas", icon: ArrowLeftRight },
  { title: "Transferências Bancárias", url: "/financeiro/transferencias-bancarias", icon: ArrowRightLeft },
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

const FinanceiroSidebar = () => {
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
              <DollarSign className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <span className="text-base font-semibold text-sidebar-foreground animate-fade-in">
                Saúde Financeiro
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
            {/* Dashboard */}
            <ul className="space-y-1 mb-2">
              <li>
                <MenuItem 
                  item={{ 
                    title: "Dashboard", 
                    url: "/financeiro", 
                    icon: CircleDollarSign,
                    tooltip: "Visão geral do módulo financeiro"
                  }} 
                  collapsed={collapsed} 
                  isActive={location.pathname === "/financeiro"} 
                />
              </li>
            </ul>

            {/* Separator */}
            <div className="my-4 mx-4 border-t border-sidebar-border/30" />

            {/* Recebimentos Group */}
            <div className="space-y-1">
              <CollapsibleMenuGroup
                title="Recebimentos"
                icon={Receipt}
                items={recebimentosItems}
                collapsed={collapsed}
                location={location}
              />
            </div>

            {/* Separator */}
            <div className="my-4 mx-4 border-t border-sidebar-border/30" />

            {/* Pagamentos Group */}
            <div className="space-y-1">
              <CollapsibleMenuGroup
                title="Pagamentos"
                icon={BadgeDollarSign}
                items={pagamentosItems}
                collapsed={collapsed}
                location={location}
              />
            </div>

            {/* Separator */}
            <div className="my-4 mx-4 border-t border-sidebar-border/30" />

            {/* Fluxos Monetários Group */}
            <div className="space-y-1">
              <CollapsibleMenuGroup
                title="Fluxos Monetários"
                icon={ArrowLeftRight}
                items={fluxosItems}
                collapsed={collapsed}
                location={location}
              />
            </div>

            {/* Separator */}
            <div className="my-4 mx-4 border-t border-sidebar-border/30" />

            {/* Relatórios Group */}
            <div className="space-y-1">
              {!collapsed ? (
                <Collapsible>
                  <CollapsibleTrigger
                    className="flex items-center justify-between w-[calc(100%-16px)] py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm px-4 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <FileBarChart className="h-5 w-5 flex-shrink-0" />
                      <span>Relatórios</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 mt-1 space-y-0.5">
                    <div className="flex items-center gap-3 py-2 mx-2 rounded-lg text-xs px-4 text-sidebar-foreground/40 italic">
                      Em breve: Relatórios Financeiros
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="flex items-center gap-3 py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm w-[calc(100%-16px)] px-3 justify-center text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    >
                      <FileBarChart className="h-5 w-5 flex-shrink-0" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-card text-card-foreground border-border">
                    <p className="font-medium">Relatórios</p>
                    <p className="text-xs text-muted-foreground italic">Em breve</p>
                  </TooltipContent>
                </Tooltip>
              )}
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
                      to="/financeiro/configuracoes"
                      className={cn(
                        "flex items-center gap-3 py-2 font-medium transition-all duration-150 mx-2 rounded-lg text-xs px-4",
                        location.pathname === "/financeiro/configuracoes"
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
                        to="/financeiro/configuracoes"
                        className={cn(
                          "flex items-center gap-3 py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm px-3 justify-center",
                          location.pathname === "/financeiro/configuracoes"
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

export default FinanceiroSidebar;
