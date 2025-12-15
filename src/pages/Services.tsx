import ServicesNavbar from "@/components/services/ServicesNavbar";
import ServiceCard from "@/components/services/ServiceCard";
import { useNavigate } from "react-router-dom";
import { Stethoscope, UserPlus, Receipt, DollarSign, Monitor, FlaskConical, Shield, ArrowLeftRight, BarChart3 } from "lucide-react";
const services = [{
  title: "Saúde Atendimento",
  description: "Gestão completa de atendimentos e consultas médicas",
  icon: Stethoscope,
  enabled: true
}, {
  title: "Saúde Cadastro",
  description: "Cadastro e gestão de pacientes e profissionais",
  icon: UserPlus,
  enabled: false
}, {
  title: "Saúde Faturamento",
  description: "Controle de faturamento e guias médicas",
  icon: Receipt,
  enabled: false
}, {
  title: "Saúde Financeiro",
  description: "Gestão financeira e controle de pagamentos",
  icon: DollarSign,
  enabled: false
}, {
  title: "Saúde Informática",
  description: "Suporte técnico e infraestrutura de TI",
  icon: Monitor,
  enabled: false
}, {
  title: "Saúde Laboratório",
  description: "Gestão de exames e resultados laboratoriais",
  icon: FlaskConical,
  enabled: false
}, {
  title: "Saúde Segurança",
  description: "Segurança da informação e compliance",
  icon: Shield,
  enabled: false
}, {
  title: "Saúde Transferência",
  description: "Transferência de pacientes e prontuários",
  icon: ArrowLeftRight,
  enabled: false
}, {
  title: "Workspace de Dashboards",
  description: "Indicadores, análises e visão geral do negócio",
  icon: BarChart3,
  enabled: true,
  isStrategic: true
}];
const Services = () => {
  const navigate = useNavigate();
  const handleServiceClick = (service: string, enabled: boolean) => {
    if (!enabled) return;
    if (service === "Saúde Atendimento") {
      navigate("/atendimento");
    } else if (service === "Workspace de Dashboards") {
      navigate("/workspace");
    }
  };
  return <div className="min-h-screen bg-gradient-services">
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
          {services.map((service, index) => <ServiceCard key={service.title} title={service.title} description={service.description} icon={service.icon} onClick={() => handleServiceClick(service.title, service.enabled)} delay={index * 60} enabled={service.enabled} isStrategic={(service as any).isStrategic} />)}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Saúde Systems © 2025 – Sistema de Saúde e Laboratório
        </p>
      </footer>
    </div>;
};
export default Services;