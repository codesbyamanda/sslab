import { ReactNode } from "react";
import LaboratorioSidebar from "./LaboratorioSidebar";
import LaboratorioNavbar from "./LaboratorioNavbar";

interface LaboratorioLayoutProps {
  children: ReactNode;
  title?: string;
  showSearch?: boolean;
}

const LaboratorioLayout = ({ children }: LaboratorioLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <LaboratorioSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <LaboratorioNavbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LaboratorioLayout;
