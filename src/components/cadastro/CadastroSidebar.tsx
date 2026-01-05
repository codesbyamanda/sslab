import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Layers,
  Users,
  Briefcase,
  Calendar,
  FileOutput,
  UserCheck,
  Coins,
  TableProperties,
  Handshake,
  Receipt,
  CreditCard,
  FileHeart,
  Stethoscope,
  Award,
  UserCog,
  Building,
  Beaker,
  TestTube,
  Package,
  Clock,
  LayoutGrid,
  FlaskConical,
  PackageOpen,
  Variable,
  Wrench,
  RefreshCw,
  FileText,
  File,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuGroups = [
  {
    label: "Administrativo",
    items: [
      { title: "Empresas", url: "/cadastro/empresas", icon: Building2 },
      { title: "Unidades", url: "/cadastro/unidades", icon: MapPin },
      { title: "Setores", url: "/cadastro/setores", icon: Layers },
      { title: "Pessoas", url: "/cadastro/pessoas", icon: Users },
      { title: "Profissões", url: "/cadastro/profissoes", icon: Briefcase },
      { title: "Feriados", url: "/cadastro/feriados", icon: Calendar },
      { title: "Destino de Laudo", url: "/cadastro/destino-laudo", icon: FileOutput },
      { title: "Terceiros", url: "/cadastro/terceiros", icon: UserCheck },
    ],
  },
  {
    label: "Financeiro / Faturamento",
    items: [
      { title: "Unidade Monetária", url: "/cadastro/unidade-monetaria", icon: Coins },
      { title: "Tabelas de Preço", url: "/cadastro/tabelas-preco", icon: TableProperties },
      { title: "Convênios", url: "/cadastro/convenios", icon: Handshake },
      { title: "Tipo de Receita", url: "/cadastro/tipo-receita", icon: Receipt },
      { title: "Tipo de Contas a Pagar", url: "/cadastro/tipo-contas-pagar", icon: Receipt },
      { title: "Adquirentes de Cartão", url: "/cadastro/adquirentes-cartao", icon: CreditCard },
    ],
  },
  {
    label: "Médico",
    items: [
      { title: "CID", url: "/cadastro/cid", icon: FileHeart },
      { title: "Especialidades Médicas", url: "/cadastro/especialidades", icon: Stethoscope },
      { title: "Conselhos Profissionais", url: "/cadastro/conselhos", icon: Award },
      { title: "Profissionais de Saúde", url: "/cadastro/profissionais-saude", icon: UserCog },
      { title: "Clínicas", url: "/cadastro/clinicas", icon: Building },
    ],
  },
  {
    label: "Laboratório",
    items: [
      { title: "Conservantes", url: "/cadastro/conservantes", icon: Beaker },
      { title: "Materiais Biológicos", url: "/cadastro/materiais-biologicos", icon: TestTube },
      { title: "Recipientes", url: "/cadastro/recipientes", icon: Package },
      { title: "Prazos de Entrega", url: "/cadastro/prazos-entrega", icon: Clock },
      { title: "Bancadas", url: "/cadastro/bancadas", icon: LayoutGrid },
      { title: "Serviços", url: "/cadastro/servicos", icon: FlaskConical },
      { title: "Kits de Serviço", url: "/cadastro/kits-servico", icon: PackageOpen },
    ],
  },
  {
    label: "Laudos",
    items: [
      { title: "Parâmetros", url: "/cadastro/parametros", icon: Variable },
      { title: "Métodos", url: "/cadastro/metodos", icon: Wrench },
      { title: "Rotinas", url: "/cadastro/rotinas", icon: RefreshCw },
      { title: "Modelos de Laudo", url: "/cadastro/modelos-laudo", icon: FileText },
      { title: "Modelos de Folha de Laudo", url: "/cadastro/modelos-folha-laudo", icon: File },
    ],
  },
];

export function CadastroSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuGroups.forEach((group) => {
      const isActive = group.items.some((item) => location.pathname.startsWith(item.url));
      initial[group.label] = isActive;
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
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
              <ClipboardList className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <span className="text-base font-semibold text-sidebar-foreground block">
                  Saúde Cadastro
                </span>
                <span className="text-xs text-sidebar-foreground/60">Cadastros e Parametrizações</span>
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
            {menuGroups.map((group, groupIndex) => (
              <Collapsible
                key={group.label}
                open={openGroups[group.label]}
                onOpenChange={() => toggleGroup(group.label)}
              >
                {groupIndex > 0 && <div className="my-3 mx-4 border-t border-sidebar-border/30" />}
                
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center justify-center py-2.5 mx-2 rounded-lg text-sm w-[calc(100%-16px)]",
                          group.items.some(item => location.pathname.startsWith(item.url))
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
                        <p className="font-medium px-3 pb-2 border-b border-border">{group.label}</p>
                        <div className="pt-2">
                          {group.items.map((item) => (
                            <button
                              key={item.url}
                              onClick={() => navigate(item.url)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors w-full text-left",
                                location.pathname.startsWith(item.url)
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
                      <span>{group.label}</span>
                      {openGroups[group.label] ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="space-y-0.5 mt-1">
                        {group.items.map((item) => {
                          const isActive = location.pathname.startsWith(item.url);
                          return (
                            <li key={item.title}>
                              <button
                                onClick={() => navigate(item.url)}
                                className={cn(
                                  "flex items-center gap-3 py-2 font-medium transition-all duration-150 mx-2 rounded-lg text-sm px-4 w-[calc(100%-16px)]",
                                  isActive
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
}

export default CadastroSidebar;
