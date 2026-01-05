import { ReactNode } from "react";
import { SegurancaSidebar } from "./SegurancaSidebar";
import { SegurancaNavbar } from "./SegurancaNavbar";

interface SegurancaLayoutProps {
  children: ReactNode;
}

export function SegurancaLayout({ children }: SegurancaLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <SegurancaSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <SegurancaNavbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
