import ServicesNavbar from "@/components/services/ServicesNavbar";
import ServiceCard from "@/components/services/ServiceCard";
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  UserPlus, 
  Receipt, 
  DollarSign, 
  Monitor, 
  FlaskConical, 
  Shield, 
  ArrowLeftRight 
} from "lucide-react";

const services = [
  {
    title: "Saúde Atendimento",
    description: "Gestão completa de atendimentos e consultas médicas",
    icon: Stethoscope,
  },
  {
    title: "Saúde Cadastro",
    description: "Cadastro e gestão de pacientes e profissionais",
    icon: UserPlus,
  },
  {
    title: "Saúde Faturamento",
    description: "Controle de faturamento e guias médicas",
    icon: Receipt,
  },
  {
    title: "Saúde Financeiro",
    description: "Gestão financeira e controle de pagamentos",
    icon: DollarSign,
  },
  {
    title: "Saúde Informática",
    description: "Suporte técnico e infraestrutura de TI",
    icon: Monitor,
  },
  {
    title: "Saúde Laboratório",
    description: "Gestão de exames e resultados laboratoriais",
    icon: FlaskConical,
  },
  {
    title: "Saúde Segurança",
    description: "Segurança da informação e compliance",
    icon: Shield,
  },
  {
    title: "Saúde Transferência",
    description: "Transferência de pacientes e prontuários",
    icon: ArrowLeftRight,
  },
];

const Services = () => {
  const navigate = useNavigate();

  const handleServiceClick = (service: string) => {
    if (service === "Saúde Atendimento") {
      navigate("/atendimento");
    } else if (service === "Saúde Faturamento") {
      navigate("/faturamento");
    } else if (service === "Saúde Financeiro") {
      navigate("/financeiro");
    } else {
      // Outros módulos ainda não implementados
      navigate("/atendimento");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-services">
      <ServicesNavbar />
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Selecione um Serviço
          </h1>
          <p className="text-base font-normal text-muted-foreground">
            Escolha o módulo que deseja acessar
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
              onClick={() => handleServiceClick(service.title)}
              delay={index * 60}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Saúde Systems © 2025 – Sistema de Saúde e Laboratório
        </p>
      </footer>
    </div>
  );
};

export default Services;
