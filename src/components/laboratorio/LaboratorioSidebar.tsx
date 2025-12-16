import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  FlaskConical,
  ChevronLeft,
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
  Settings2,
  Globe,
  FileBarChart,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MenuGroup {
  title: string;
  items: MenuItem[];
  defaultOpen?: boolean;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

const menuGroups: MenuGroup[] = [
  {
    title: "Mapa de Trabalho",
    defaultOpen: true,
    items: [
      { title: "Lotes de Amostras", icon: Package, path: "/laboratorio/lotes-amostras" },
      { title: "Amostras", icon: TestTube2, path: "/laboratorio/amostras" },
      { title: "Filtro do Mapa", icon: Filter, path: "/laboratorio/filtro-mapa" },
      { title: "Mapa de Trabalho", icon: Map, path: "/laboratorio/mapa-trabalho" },
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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    menuGroups.reduce((acc, group) => {
      acc[group.title] = group.defaultOpen ?? false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 min-h-screen gradient-navy flex flex-col shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-accent flex items-center justify-center">
            <FlaskConical className="h-5 w-5 text-dourado-sutil" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sidebar-foreground">Saúde Laboratório</h2>
            <p className="text-xs text-sidebar-foreground/60">Rotinas Técnicas</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {/* Home Link */}
        <div className="px-2 mb-2">
          <button
            onClick={() => navigate("/laboratorio")}
            className={cn(
              "flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200",
              "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              location.pathname === "/laboratorio" && "bg-sidebar-accent text-sidebar-foreground font-medium"
            )}
          >
            <LayoutDashboard
              className={cn(
                "h-5 w-5 shrink-0",
                location.pathname === "/laboratorio" && "text-dourado-sutil"
              )}
            />
            <span className="text-sm">Tela Principal</span>
          </button>
        </div>

        {/* Menu Groups */}
        {menuGroups.map((group) => (
          <Collapsible
            key={group.title}
            open={openGroups[group.title]}
            onOpenChange={() => toggleGroup(group.title)}
            className="mb-1"
          >
            <div className="px-3">
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-colors">
                <span>{group.title}</span>
                {openGroups[group.title] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <ul className="space-y-1 px-2">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200",
                        "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                        isActive(item.path) && "bg-sidebar-accent text-sidebar-foreground font-medium"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive(item.path) && "text-dourado-sutil"
                        )}
                      />
                      <span className="text-sm">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors text-sm w-full px-4 py-2.5 rounded-lg hover:bg-sidebar-accent/30"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar aos Módulos
        </button>
      </div>
    </aside>
  );
};

export default LaboratorioSidebar;
