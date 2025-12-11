import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppNavbar from "./AppNavbar";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-cinza-claro">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppNavbar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
