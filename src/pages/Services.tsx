import ServicesNavbar from "@/components/services/ServicesNavbar";
import ServiceCard from "@/components/services/ServiceCard";
import { useNavigate } from "react-router-dom";
import { Stethoscope, UserPlus, Receipt, DollarSign, Cpu, FlaskConical, Shield, ArrowLeftRight, BarChart3 } from "lucide-react";

const services = [
  {
    title: "Saúde Atendimento",
    description: "Gestão completa de atendimentos e consultas médicas",
    icon: Stethoscope,
    enabled: true
  },
  {
    title: "Saúde Cadastro",
    description: "Cadastro e gestão de pacientes e profissionais",
    icon: UserPlus,
    enabled: true
  },
  {
    title: "Saúde Faturamento",
    description: "Controle de faturamento e guias médicas",
    icon: Receipt,
    enabled: true
  },
  {
    title: "Saúde Financeiro",
    description: "Gestão financeira e controle de pagamentos",
    icon: DollarSign,
    enabled: true
  },
  {
    title: "Saúde Interfaciamento",
    description: "Automação laboratorial e comunicação com equipamentos",
    icon: Cpu,
    enabled: true
  },
  {
    title: "Saúde Laboratório",
    description: "Gestão de exames e resultados laboratoriais",
    icon: FlaskConical,
    enabled: true
  },
  {
    title: "Saúde Segurança",
    description: "Segurança da informação e compliance",
    icon: Shield,
    enabled: true
  },
  {
    title: "Saúde Transferência",
    description: "Transferência de pacientes e prontuários",
    icon: ArrowLeftRight,
    enabled: true
  },
  {
    title: "Workspace de Dashboards",
    description: "Indicadores, análises e visão geral do negócio",
    icon: BarChart3,
    enabled: true,
    isStrategic: true
  }
];

const Services = () => {
  const navigate = useNavigate();

  const handleServiceClick = (service: string, enabled: boolean) => {
    if (!enabled) return;
    
    const routes: Record<string, string> = {
      "Saúde Atendimento": "/atendimento",
      "Saúde Cadastro": "/cadastro",
      "Saúde Faturamento": "/faturamento",
      "Saúde Financeiro": "/financeiro",
      "Saúde Interfaciamento": "/interfaciamento",
      "Saúde Laboratório": "/laboratorio",
      "Saúde Segurança": "/seguranca",
      "Saúde Transferência": "/transferencia",
      "Workspace de Dashboards": "/workspace"
    };
    
    const route = routes[service];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-services">
      <ServicesNavbar />
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-3">Selecione um Módulo</h1>
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
              onClick={() => handleServiceClick(service.title, service.enabled)}
              delay={index * 60}
              enabled={service.enabled}
              isStrategic={(service as any).isStrategic}
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
