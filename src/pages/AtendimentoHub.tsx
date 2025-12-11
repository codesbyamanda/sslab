import { ArrowLeft, User, ClipboardList, Package, Calculator, UserCog, FileText, Wallet, Receipt, ArrowLeftRight, FileBarChart, Calendar, Building2, Users, TrendingDown, Clock, AlertCircle, CreditCard, Settings, LogOut } from "lucide-react";
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

interface SmallCardProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

const SmallCard = ({ icon, title, onClick }: SmallCardProps) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-3 p-4 bg-card rounded-xl shadow-sm hover:shadow-md border border-border/50 hover:border-petroleo/30 transition-all duration-200 text-left w-full"
  >
    <div className="w-10 h-10 rounded-lg bg-petroleo/10 flex items-center justify-center group-hover:bg-petroleo/20 transition-colors flex-shrink-0">
      {icon}
    </div>
    <span className="text-sm font-medium text-foreground">{title}</span>
  </button>
);

const AtendimentoHub = () => {
  const navigate = useNavigate();

  const atendimentoCards = [
    {
      icon: <User className="h-6 w-6 text-petroleo" />,
      title: "Paciente",
      description: "Cadastro completo do paciente com informações pessoais e histórico"
    },
    {
      icon: <ClipboardList className="h-6 w-6 text-petroleo" />,
      title: "Atendimento",
      description: "Cadastro de requisições e gerenciamento de atendimentos"
    },
    {
      icon: <Package className="h-6 w-6 text-petroleo" />,
      title: "Recebimento de Material",
      description: "Controle de entrada e recebimento de materiais"
    },
    {
      icon: <Calculator className="h-6 w-6 text-petroleo" />,
      title: "Orçamento",
      description: "Criação e gestão de orçamentos para pacientes"
    },
    {
      icon: <UserCog className="h-6 w-6 text-petroleo" />,
      title: "Profissionais de Saúde",
      description: "Cadastro e gestão de médicos e profissionais"
    },
    {
      icon: <FileText className="h-6 w-6 text-petroleo" />,
      title: "Impressão de Laudos",
      description: "Emissão e impressão de laudos médicos"
    }
  ];

  const financeiroCards = [
    {
      icon: <Wallet className="h-5 w-5 text-petroleo" />,
      title: "Caixa"
    },
    {
      icon: <Receipt className="h-5 w-5 text-petroleo" />,
      title: "Registros de Caixa"
    },
    {
      icon: <ArrowLeftRight className="h-5 w-5 text-petroleo" />,
      title: "Transferência de Caixa"
    }
  ];

  const relatoriosCards = [
    { icon: <Calendar className="h-5 w-5 text-petroleo" />, title: "Atendimento Diário" },
    { icon: <Building2 className="h-5 w-5 text-petroleo" />, title: "Atendimento por Convênio" },
    { icon: <Users className="h-5 w-5 text-petroleo" />, title: "Atendimento Particular" },
    { icon: <TrendingDown className="h-5 w-5 text-petroleo" />, title: "Movimentação Financeira" },
    { icon: <AlertCircle className="h-5 w-5 text-petroleo" />, title: "Devedores" },
    { icon: <Clock className="h-5 w-5 text-petroleo" />, title: "Promessa de Entrega" },
    { icon: <ClipboardList className="h-5 w-5 text-petroleo" />, title: "Itens Pendentes" },
    { icon: <CreditCard className="h-5 w-5 text-petroleo" />, title: "Faturamentos" }
  ];

  const geralCards = [
    {
      icon: <Settings className="h-5 w-5 text-petroleo" />,
      title: "Configurações do Atendimento"
    },
    {
      icon: <LogOut className="h-5 w-5 text-vermelho-moderno" />,
      title: "Sair do Sistema"
    }
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button 
            onClick={() => navigate("/services")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
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
              Acesse as funcionalidades do módulo de atendimento
            </p>
          </div>

          {/* GRUPO 1 — Atendimento */}
          <section className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-petroleo rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Atendimento</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {atendimentoCards.map((card, index) => (
                <HubCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                />
              ))}
            </div>
          </section>

          {/* GRUPO 2 — Financeiro */}
          <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-verde-clinico rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Financeiro</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {financeiroCards.map((card, index) => (
                <SmallCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                />
              ))}
            </div>
          </section>

          {/* GRUPO 3 — Relatórios */}
          <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-ambar-suave rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Relatórios</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {relatoriosCards.map((card, index) => (
                <SmallCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                />
              ))}
            </div>
          </section>

          {/* GRUPO 4 — Geral */}
          <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-cinza-profissional/50 rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Geral</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {geralCards.map((card, index) => (
                <SmallCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  onClick={card.title === "Sair do Sistema" ? () => navigate("/services") : undefined}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AtendimentoHub;
