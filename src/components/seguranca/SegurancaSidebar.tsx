import { Shield, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Grupo de Controle de Acesso",
    icon: Users,
    path: "/seguranca/grupo-controle-acesso",
  },
];

export function SegurancaSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside className="w-64 bg-[#1a365d] min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">Saúde Segurança</h1>
            <p className="text-blue-200 text-xs">Controle de Acesso</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-white/20 text-white"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => navigate("/services")}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
        >
          ← Voltar aos Módulos
        </button>
      </div>
    </aside>
  );
}
