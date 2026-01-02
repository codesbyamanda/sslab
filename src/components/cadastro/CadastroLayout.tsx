import { SidebarProvider } from "@/components/ui/sidebar";
import { CadastroSidebar } from "./CadastroSidebar";
import { CadastroNavbar } from "./CadastroNavbar";
import { Outlet } from "react-router-dom";

export function CadastroLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CadastroSidebar />
        <div className="flex-1 flex flex-col">
          <CadastroNavbar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default CadastroLayout;
