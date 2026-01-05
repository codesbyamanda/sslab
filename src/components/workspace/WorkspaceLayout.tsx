import { ReactNode } from "react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceNavbar from "./WorkspaceNavbar";

interface WorkspaceLayoutProps {
  children: ReactNode;
  title?: string;
  showExport?: boolean;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceNavbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
