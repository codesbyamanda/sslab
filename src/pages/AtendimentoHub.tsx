import { 
  ArrowLeft, 
  User, 
  ClipboardList, 
  Package, 
  Calculator, 
  UserCog, 
  FileText, 
  Wallet, 
  Receipt, 
  ArrowLeftRight, 
  FileBarChart, 
  Calendar, 
  Building2, 
  Users, 
  TrendingDown, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  Settings, 
  LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";

interface HubCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

const HubCard = ({ icon, title, description, onClick }: HubCardProps) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-start p-5 bg-card rounded-2xl shadow-card hover:shadow-card-hover border border-border/50 hover:border-petroleo/30 transition-all duration-200 text-left w-full"
  >
    <div className="w-12 h-12 rounded-xl bg-petroleo/10 flex items-center justify-center mb-4 group-hover:bg-petroleo/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </button>
);

interface MediumCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

const MediumCard = ({ icon, title, description, onClick }: MediumCardProps) => (
  <button
    onClick={onClick}
    className="group flex items-start gap-4 p-4 bg-card rounded-xl shadow-card hover:shadow-card-hover border border-border/50 hover:border-verde-clinico/30 transition-all duration-200 text-left w-full"
  >
    <div className="w-10 h-10 rounded-lg bg-verde-clinico/10 flex items-center justify-center group-hover:bg-verde-clinico/20 transition-colors flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-0.5">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </button>
);

interface SmallCardProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

const SmallCard = ({ icon, title, onClick }: SmallCardProps) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-3 p-3 bg-card rounded-lg shadow-sm hover:shadow-md border border-border/50 hover:border-ambar-suave/30 transition-all duration-200 text-left w-full"
  >
    <div className="w-8 h-8 rounded-md bg-ambar-suave/10 flex items-center justify-center group-hover:bg-ambar-suave/20 transition-colors flex-shrink-0">
      {icon}
    </div>
    <span className="text-xs font-medium text-foreground">{title}</span>
  </button>
);

const AtendimentoHub = () => {
  const navigate = useNavigate();

  const atendimentoCards = [
    {
      icon: <User className="h-6 w-6 text-petroleo" />,
      title: "Paciente",
      description: "Cadastro completo do paciente com informações pessoais e histórico",
      url: "/atendimento/paciente"
    },
    {
      icon: <ClipboardList className="h-6 w-6 text-petroleo" />,
      title: "Atendimento",
      description: "Cadastro de requisições e gerenciamento de atendimentos",
      url: "/atendimento/atendimentos"
    },
    {
      icon: <Package className="h-6 w-6 text-petroleo" />,
      title: "Recebimento de Material",
      description: "Controle de entrada e recebimento de materiais",
      url: "/atendimento/recebimento"
    },
    {
      icon: <Calculator className="h-6 w-6 text-petroleo" />,
      title: "Orçamento",
      description: "Criação e gestão de orçamentos para pacientes",
      url: "/atendimento/orcamento"
    },
    {
      icon: <UserCog className="h-6 w-6 text-petroleo" />,
      title: "Profissionais de Saúde",
      description: "Cadastro e gestão de médicos e profissionais",
      url: "/atendimento/profissionais"
    },
    {
      icon: <FileText className="h-6 w-6 text-petroleo" />,
      title: "Impressão de Laudos",
      description: "Emissão e impressão de laudos médicos",
      url: "/atendimento/laudos"
    }
  ];

  const financeiroCards = [
    {
      icon: <Wallet className="h-5 w-5 text-verde-clinico" />,
      title: "Caixa",
      description: "Controle de caixa e movimentações",
      url: "/atendimento/caixa"
    },
    {
      icon: <Receipt className="h-5 w-5 text-verde-clinico" />,
      title: "Registros de Caixa",
      description: "Histórico de registros financeiros",
      url: "/atendimento/registros-caixa"
    },
    {
      icon: <ArrowLeftRight className="h-5 w-5 text-verde-clinico" />,
      title: "Transferência de Caixa",
      description: "Transferências entre caixas",
      url: "/atendimento/transferencia-caixa"
    }
  ];

  const relatoriosCards = [
    { icon: <Calendar className="h-4 w-4 text-ambar-suave" />, title: "Atendimento Diário", url: "/atendimento/relatorios/diario" },
    { icon: <Building2 className="h-4 w-4 text-ambar-suave" />, title: "Atendimento por Convênio", url: "/atendimento/relatorios/convenio" },
    { icon: <Users className="h-4 w-4 text-ambar-suave" />, title: "Atendimento Particular", url: "/atendimento/relatorios/particular" },
    { icon: <TrendingDown className="h-4 w-4 text-ambar-suave" />, title: "Movimentação Financeira", url: "/atendimento/relatorios/financeiro" },
    { icon: <AlertCircle className="h-4 w-4 text-ambar-suave" />, title: "Devedores", url: "/atendimento/relatorios/devedores" },
    { icon: <Clock className="h-4 w-4 text-ambar-suave" />, title: "Promessa de Entrega", url: "/atendimento/relatorios/promessa" },
    { icon: <ClipboardList className="h-4 w-4 text-ambar-suave" />, title: "Itens Pendentes", url: "/atendimento/relatorios/pendentes" },
    { icon: <CreditCard className="h-4 w-4 text-ambar-suave" />, title: "Faturamentos", url: "/atendimento/relatorios/faturamentos" }
  ];

  const geralCards = [
    {
      icon: <Settings className="h-5 w-5 text-cinza-profissional" />,
      title: "Configurações do Atendimento",
      url: "/atendimento/configuracoes"
    },
    {
      icon: <LogOut className="h-5 w-5 text-vermelho-moderno" />,
      title: "Sair do Sistema",
      url: "/services"
    }
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />
      
      {/* Main content with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 ml-64">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button 
            onClick={() => navigate("/services")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Serviços</span>
          </button>

          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">
              Módulo de Atendimento
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acesse as funcionalidades do módulo através dos cards abaixo ou pelo menu lateral.
            </p>
          </div>

          {/* GRUPO 1 — Atendimento */}
          <section className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-7 bg-petroleo rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Atendimento</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {atendimentoCards.map((card, index) => (
                <HubCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  onClick={() => navigate(card.url)}
                />
              ))}
            </div>
          </section>

          {/* GRUPO 2 — Financeiro */}
          <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-7 bg-verde-clinico rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Financeiro</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {financeiroCards.map((card, index) => (
                <MediumCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  onClick={() => navigate(card.url)}
                />
              ))}
            </div>
          </section>

          {/* GRUPO 3 — Relatórios */}
          <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-7 bg-ambar-suave rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Relatórios</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {relatoriosCards.map((card, index) => (
                <SmallCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  onClick={() => navigate(card.url)}
                />
              ))}
            </div>
          </section>

          {/* GRUPO 4 — Geral */}
          <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-7 bg-cinza-profissional/40 rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Geral</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {geralCards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => navigate(card.url)}
                  className={`group flex items-center gap-3 p-4 bg-card rounded-xl shadow-sm hover:shadow-md border border-border/50 transition-all duration-200 text-left w-full ${
                    card.title === "Sair do Sistema" 
                      ? "hover:border-vermelho-moderno/30" 
                      : "hover:border-cinza-profissional/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                    card.title === "Sair do Sistema"
                      ? "bg-vermelho-moderno/10 group-hover:bg-vermelho-moderno/20"
                      : "bg-cinza-profissional/10 group-hover:bg-cinza-profissional/20"
                  }`}>
                    {card.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground">{card.title}</span>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AtendimentoHub;