import { Activity, LogOut, User, FileText, Calculator, FileCheck, RefreshCw, ClipboardList, BarChart3, FileSpreadsheet, Settings, ArrowLeft, FolderOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Menu items structure
const menuGroups = [
  {
    title: "Faturamento",
    items: [
      { title: "Pré-Faturamento", icon: FileText, path: "/faturamento/pre-faturamento" },
      { title: "Faturamento", icon: Calculator, path: "/faturamento/faturamento" },
      { title: "Guias", icon: FileCheck, path: "/faturamento/guias" },
      { title: "Recalcula Guias", icon: RefreshCw, path: "/faturamento/recalcula-guias" },
    ],
  },
  {
    title: "Relatórios",
    items: [
      { title: "Pré-Fatura / Conferência de Guias", icon: ClipboardList, path: "/faturamento/relatorios/pre-fatura" },
      { title: "Relatório de Faturamento", icon: BarChart3, path: "/faturamento/relatorios/faturamento" },
      { title: "Relatórios Diversos", icon: FileSpreadsheet, path: "/faturamento/relatorios/diversos" },
    ],
  },
  {
    title: "Geral",
    items: [
      { title: "Parâmetros", icon: Settings, path: "/faturamento/parametros" },
      { title: "Sair do Módulo", icon: ArrowLeft, path: "/services", isExit: true },
    ],
  },
];

const FaturamentoNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-card border-b border-border/50 flex items-center justify-between px-6 shadow-navbar flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <Activity className="h-5 w-5 text-primary" strokeWidth={2.5} />
        <span className="text-lg font-bold text-primary italic">
          Saúde Systems
        </span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-medium text-foreground">Olá, Ednaldo</span>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-vermelho-moderno transition-colors duration-150"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
};

const FaturamentoSidebar = ({ activePath, onNavigate }: { activePath: string; onNavigate: (path: string) => void }) => {
  return (
    <TooltipProvider>
      <aside className="w-64 bg-card border-r border-border/50 flex flex-col flex-shrink-0 h-full">
        {/* Module Title */}
        <div className="p-4 border-b border-border/30">
          <h2 className="text-base font-semibold text-foreground">Saúde Faturamento</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Controle de faturamento e guias</p>
        </div>

        {/* Menu Groups */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
                {group.title}
              </h3>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activePath === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <li key={item.path}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onNavigate(item.path)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                              item.isExit && "text-vermelho-moderno hover:text-vermelho-moderno hover:bg-vermelho-moderno/10"
                            )}
                          >
                            <Icon className={cn(
                              "h-4 w-4 flex-shrink-0",
                              isActive ? "text-primary" : item.isExit ? "text-vermelho-moderno" : "text-azul-acinzentado"
                            )} />
                            <span className="truncate">{item.title}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
};

const SaudeFaturamento = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState("");

  const handleNavigate = (path: string) => {
    if (path === "/services") {
      navigate("/services");
    } else {
      setActivePath(path);
      // For now, just set the active path - pages will be created later
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FaturamentoNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        <FaturamentoSidebar activePath={activePath} onNavigate={handleNavigate} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background p-8">
          {activePath ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {menuGroups.flatMap(g => g.items).find(i => i.path === activePath)?.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Esta funcionalidade será implementada em breve.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                <FolderOpen className="h-10 w-10 text-azul-acinzentado/60" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Selecione uma opção no menu ao lado
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Escolha uma das opções do menu lateral para iniciar o processo de faturamento.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SaudeFaturamento;
