import { ReactNode } from "react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceNavbar from "./WorkspaceNavbar";

interface WorkspaceLayoutProps {
  children: ReactNode;
  title?: string;
}

const WorkspaceLayout = ({ children, title }: WorkspaceLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col">
        <WorkspaceNavbar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
