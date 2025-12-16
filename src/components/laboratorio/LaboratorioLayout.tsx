import { ReactNode } from "react";
import LaboratorioSidebar from "./LaboratorioSidebar";
import LaboratorioNavbar from "./LaboratorioNavbar";

interface LaboratorioLayoutProps {
  children: ReactNode;
  title?: string;
  showSearch?: boolean;
}

const LaboratorioLayout = ({ children, title, showSearch = false }: LaboratorioLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <LaboratorioSidebar />
      <div className="flex-1 flex flex-col">
        <LaboratorioNavbar title={title} showSearch={showSearch} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LaboratorioLayout;
