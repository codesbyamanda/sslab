import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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
    <Sidebar className="border-r border-border bg-[#1e3a5f] text-white">
      <SidebarContent className="pt-4">
        <div className="px-4 mb-4">
          <h2 className="text-lg font-semibold text-white">Saúde Cadastro</h2>
          <p className="text-xs text-blue-200">Cadastros e Parametrizações</p>
        </div>

        {menuGroups.map((group) => (
          <Collapsible
            key={group.label}
            open={openGroups[group.label]}
            onOpenChange={() => toggleGroup(group.label)}
          >
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="text-blue-200 hover:text-white cursor-pointer flex items-center justify-between px-4 py-2">
                  <span>{group.label}</span>
                  {openGroups[group.label] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = location.pathname.startsWith(item.url);
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            onClick={() => navigate(item.url)}
                            className={`text-blue-100 hover:bg-blue-800/50 hover:text-white ${
                              isActive ? "bg-blue-800 text-white" : ""
                            }`}
                          >
                            <item.icon className="h-4 w-4 mr-2" />
                            <span className="text-sm">{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export default CadastroSidebar;
