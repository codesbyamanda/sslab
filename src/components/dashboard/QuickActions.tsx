import { Plus, UserPlus, FileText, Calendar } from "lucide-react";

const actions = [
  { title: "Novo Exame", icon: Plus, color: "bg-petroleo" },
  { title: "Cadastrar Paciente", icon: UserPlus, color: "bg-verde-clinico" },
  { title: "Gerar Laudo", icon: FileText, color: "bg-ambar-suave" },
  { title: "Agendar", icon: Calendar, color: "bg-petroleo-light" },
];

const QuickActions = () => {
  return (
    <div className="card-premium p-6 animate-fade-in-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button 
            key={action.title}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all duration-150 group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-150`}>
              <action.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
