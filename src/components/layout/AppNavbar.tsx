import { Bell, Search, User } from "lucide-react";

interface AppNavbarProps {
  title?: string;
}

const AppNavbar = ({ title = "Dashboard" }: AppNavbarProps) => {
  return (
    <header className="navbar-premium">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-10 w-64 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
          />
        </div>

        {/* Notifications */}
        <button className="relative h-10 w-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-vermelho-moderno" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">Dr. Carlos Silva</p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-petroleo flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
