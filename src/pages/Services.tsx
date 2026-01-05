import ServicesNavbar from "@/components/services/ServicesNavbar";
import ServiceCard from "@/components/services/ServiceCard";
import { useNavigate } from "react-router-dom";
import { Stethoscope, UserPlus, Receipt, DollarSign, Cpu, FlaskConical, Shield, ArrowLeftRight, BarChart3 } from "lucide-react";

// Módulos organizados por perfil funcional
const moduloRecepcao = [
  {
    title: "Saúde Atendimento",
    description: "Gestão completa de atendimentos e consultas médicas",
    icon: Stethoscope,
    enabled: true
  },
  {
    title: "Saúde Laboratório",
    description: "Gestão de exames e resultados laboratoriais",
    icon: FlaskConical,
    enabled: true
  },
  {
    title: "Saúde Interfaciamento",
    description: "Automação laboratorial e comunicação com equipamentos",
    icon: Cpu,
    enabled: true
  },
  {
    title: "Saúde Transferência",
    description: "Transferência de pacientes e prontuários",
    icon: ArrowLeftRight,
    enabled: true
  }
];

const moduloFinanceiro = [
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
  }
];

const moduloAdministracao = [
  {
    title: "Workspace de Dashboards",
    description: "Indicadores, análises e visão geral do negócio",
    icon: BarChart3,
    enabled: true,
    isStrategic: true
  },
  {
    title: "Saúde Cadastro",
    description: "Cadastro e gestão de pacientes e profissionais",
    icon: UserPlus,
    enabled: true
  },
  {
    title: "Saúde Segurança",
    description: "Segurança da informação e compliance",
    icon: Shield,
    enabled: true
  }
];

interface ModuleSection {
  title: string;
  description: string;
  modules: typeof moduloRecepcao;
}

const sections: ModuleSection[] = [
  {
    title: "Recepção",
    description: "Módulos operacionais de atendimento e rotina clínica",
    modules: moduloRecepcao
  },
  {
    title: "Financeiro",
    description: "Módulos de gestão financeira e faturamento",
    modules: moduloFinanceiro
  },
  {
    title: "Administração",
    description: "Módulos administrativos, cadastros e gestão do sistema",
    modules: moduloAdministracao
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
    <div className="min-h-screen bg-gradient-services flex flex-col">
      <ServicesNavbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 pb-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-3">Selecione um Módulo</h1>
          <p className="text-base font-normal text-muted-foreground">
            Escolha o módulo que deseja acessar
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, sectionIndex) => (
            <section key={section.title} className="animate-fade-in" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
              {/* Section Header */}
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
              </div>

              {/* Section Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {section.modules.map((service, index) => (
                  <ServiceCard
                    key={service.title}
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    onClick={() => handleServiceClick(service.title, service.enabled)}
                    delay={(sectionIndex * 100) + (index * 60)}
                    enabled={service.enabled}
                    isStrategic={(service as any).isStrategic}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 py-4 text-center bg-background/80 backdrop-blur-sm border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Saúde Systems © 2025 – Sistema de Saúde e Laboratório
        </p>
      </footer>
    </div>
  );
};

export default Services;
