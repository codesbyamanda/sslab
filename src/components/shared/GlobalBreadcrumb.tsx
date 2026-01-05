import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface GlobalBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const moduleLabels: Record<string, string> = {
  atendimento: "Saúde Atendimento",
  cadastro: "Saúde Cadastro",
  financeiro: "Saúde Financeiro",
  faturamento: "Saúde Faturamento",
  laboratorio: "Saúde Laboratório",
  seguranca: "Saúde Segurança",
  transferencia: "Saúde Transferência",
  interfaciamento: "Saúde Interfaciamento",
  workspace: "Workspace",
};

const sectionLabels: Record<string, string> = {
  // Atendimento
  pacientes: "Pacientes",
  atendimentos: "Atendimentos",
  orcamento: "Orçamento",
  profissionais: "Profissionais",
  laudos: "Impressão de Laudos",
  // Cadastro
  empresas: "Empresas",
  unidades: "Unidades",
  setores: "Setores",
  pessoas: "Pessoas",
  profissoes: "Profissões",
  feriados: "Feriados",
  "destino-laudo": "Destino de Laudo",
  terceiros: "Terceiros",
  "unidade-monetaria": "Unidade Monetária",
  "tabelas-preco": "Tabelas de Preço",
  convenios: "Convênios",
  "tipo-receita": "Tipo de Receita",
  "tipo-contas-pagar": "Tipo de Contas a Pagar",
  "adquirentes-cartao": "Adquirentes de Cartão",
  cid: "CID",
  especialidades: "Especialidades Médicas",
  conselhos: "Conselhos Profissionais",
  "profissionais-saude": "Profissionais de Saúde",
  clinicas: "Clínicas",
  conservantes: "Conservantes",
  "materiais-biologicos": "Materiais Biológicos",
  recipientes: "Recipientes",
  "prazos-entrega": "Prazos de Entrega",
  bancadas: "Bancadas",
  servicos: "Serviços",
  "kits-servico": "Kits de Serviço",
  parametros: "Parâmetros",
  metodos: "Métodos",
  rotinas: "Rotinas",
  "modelos-laudo": "Modelos de Laudo",
  "modelos-folha-laudo": "Modelos de Folha",
  // Financeiro
  receitas: "Receitas a Receber",
  cheques: "Cheques",
  "transacoes-cartao": "Transações Cartão",
  depositos: "Depósitos",
  "repasse-cartao": "Repasse Cartão",
  "contas-pagar": "Contas a Pagar",
  "cheques-emitidos": "Cheques Emitidos",
  caixas: "Caixas",
  "contas-correntes": "Contas Correntes",
  "transferencias-caixas": "Transferências entre Caixas",
  "transferencias-bancarias": "Transferências Bancárias",
  // Faturamento
  "pre-faturamento": "Pré-Faturamento",
  guias: "Guias",
  "listagem-faturamento": "Listagem Faturamento",
  relatorios: "Relatórios",
  // Laboratório
  "lotes-amostras": "Lotes de Amostras",
  amostras: "Amostras",
  "filtro-mapa": "Filtro do Mapa",
  "mapa-trabalho": "Mapas de Trabalho",
  "digitacao-paciente": "Digitação por Paciente",
  "digitacao-mapa": "Digitação por Mapa",
  "impressao-laudo": "Impressão de Laudo",
  "gerar-laudos-lote": "Gerar Laudos Lote",
  "config-geral": "Configurações Gerais",
  "config-impressao": "Configurações de Impressão",
  "config-laudo-internet": "Laudo de Internet",
  // Segurança
  "grupo-acesso": "Grupo de Acesso",
  "perfil-acesso": "Perfil de Acesso",
  // Transferência
  "nova-transferencia": "Nova Transferência",
  historico: "Histórico",
  configuracoes: "Configurações",
  // Workspace
  visao: "Visão Geral",
  personalizados: "Personalizados",
};

export function GlobalBreadcrumb({ items, className }: GlobalBreadcrumbProps) {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items && items.length > 0) {
      return [{ label: "Início", path: "/services" }, ...items];
    }
    
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Início", path: "/services" }];
    
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      if (index === 0) {
        // Module name
        const moduleLabel = moduleLabels[segment] || segment;
        breadcrumbs.push({ label: moduleLabel, path: currentPath });
      } else {
        // Section or sub-section
        const sectionLabel = sectionLabels[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        breadcrumbs.push({ 
          label: sectionLabel, 
          path: index < pathSegments.length - 1 ? currentPath : undefined 
        });
      }
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className={cn("flex items-center text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            )}
            {index === 0 ? (
              <Link
                to={item.path || "/services"}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            ) : item.path && index < breadcrumbs.length - 1 ? (
              <Link
                to={item.path}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default GlobalBreadcrumb;
