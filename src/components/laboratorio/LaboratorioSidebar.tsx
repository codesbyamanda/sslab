import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Filter,
  Map,
  Package,
  TestTube2,
  UserCheck,
  FileText,
  Printer,
  Files,
  Settings,
  Globe,
  FileBarChart,
} from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuGroup {
  title: string;
  items: MenuItem[];
  defaultOpen?: boolean;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path: string;
  tooltip?: string;
}

const menuGroups: MenuGroup[] = [
  {
    title: "Mapa de Trabalho",
    defaultOpen: true,
    items: [
      { title: "Lotes de Amostras", icon: Package, path: "/laboratorio/lotes-amostras" },
      { title: "Amostras", icon: TestTube2, path: "/laboratorio/amostras" },
      { title: "Filtro do Mapa", icon: Filter, path: "/laboratorio/filtro-mapa" },
      { title: "Mapas de Trabalho", icon: Map, path: "/laboratorio/mapa-trabalho" },
    ],
  },
  {
    title: "Laudo",
    defaultOpen: true,
    items: [
      { title: "Digitação por Paciente", icon: UserCheck, path: "/laboratorio/digitacao-paciente" },
      { title: "Digitação por Mapa", icon: FileText, path: "/laboratorio/digitacao-mapa" },
      { title: "Impressão Laudo", icon: Printer, path: "/laboratorio/impressao-laudo" },
      { title: "Gerar Laudos Lote", icon: Files, path: "/laboratorio/gerar-laudos-lote" },
    ],
  },
  {
    title: "Relatórios",
    items: [
      { title: "Relatórios", icon: FileBarChart, path: "/laboratorio/relatorios" },
    ],
  },
  {
    title: "Configurações",
    items: [
      { title: "Geral", icon: Settings, path: "/laboratorio/config-geral" },
      { title: "Impressão", icon: Printer, path: "/laboratorio/config-impressao" },
      { title: "Laudo de Internet", icon: Globe, path: "/laboratorio/config-laudo-internet" },
    ],
  },
];

const LaboratorioSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    menuGroups.reduce((acc, group) => {
      const isActive = group.items.some(item => location.pathname.startsWith(item.path));
      acc[group.title] = group.defaultOpen || isActive;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
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
              <FlaskConical className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <span className="text-base font-semibold text-sidebar-foreground block">
                  Saúde Laboratório
                </span>
                <span className="text-xs text-sidebar-foreground/60">Rotinas Técnicas</span>
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
            {/* Home Link */}
            <ul className="space-y-1 mb-2">
              <li>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => navigate("/laboratorio")}
                        className={cn(
                          "flex items-center gap-3 py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm w-[calc(100%-16px)] px-3 justify-center",
                          location.pathname === "/laboratorio"
                            ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-dourado-sutil"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-card text-card-foreground border-border">
                      Tela Principal
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => navigate("/laboratorio")}
                    className={cn(
                      "flex items-center gap-3 py-2.5 font-medium transition-all duration-150 mx-2 rounded-lg text-sm px-4 w-[calc(100%-16px)]",
                      location.pathname === "/laboratorio"
                        ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-dourado-sutil"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                    <span>Tela Principal</span>
                  </button>
                )}
              </li>
            </ul>

            {/* Menu Groups */}
            {menuGroups.map((group, groupIndex) => (
              <Collapsible
                key={group.title}
                open={openGroups[group.title]}
                onOpenChange={() => toggleGroup(group.title)}
              >
                {groupIndex > 0 && <div className="my-3 mx-4 border-t border-sidebar-border/30" />}
                
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center justify-center py-2.5 mx-2 rounded-lg text-sm w-[calc(100%-16px)]",
                          group.items.some(item => isActive(item.path))
                            ? "bg-sidebar-accent text-sidebar-foreground"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        {group.items[0] && (() => {
                          const FirstIcon = group.items[0].icon;
                          return <FirstIcon className="h-5 w-5" />;
                        })()}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-card text-card-foreground border-border p-0 max-h-80 overflow-y-auto">
                      <div className="py-2">
                        <p className="font-medium px-3 pb-2 border-b border-border">{group.title}</p>
                        <div className="pt-2">
                          {group.items.map((item) => (
                            <button
                              key={item.path}
                              onClick={() => navigate(item.path)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors w-full text-left",
                                isActive(item.path)
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <CollapsibleTrigger
                      className="flex items-center justify-between w-[calc(100%-16px)] py-2 px-4 mx-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-colors"
                    >
                      <span>{group.title}</span>
                      {openGroups[group.title] ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="space-y-0.5 mt-1">
                        {group.items.map((item) => {
                          const active = isActive(item.path);
                          return (
                            <li key={item.path}>
                              <button
                                onClick={() => navigate(item.path)}
                                className={cn(
                                  "flex items-center gap-3 py-2 font-medium transition-all duration-150 mx-2 rounded-lg text-sm px-4 w-[calc(100%-16px)]",
                                  active
                                    ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-dourado-sutil"
                                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                )}
                              >
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="text-sm">{item.title}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </CollapsibleContent>
                  </>
                )}
              </Collapsible>
            ))}
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
};

export default LaboratorioSidebar;
