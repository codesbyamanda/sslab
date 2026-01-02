import { Outlet } from "react-router-dom";
import { InterfaciamentoSidebar } from "./InterfaciamentoSidebar";
import { InterfaciamentoNavbar } from "./InterfaciamentoNavbar";

export function InterfaciamentoLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <InterfaciamentoSidebar />
      <div className="flex-1 flex flex-col">
        <InterfaciamentoNavbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
