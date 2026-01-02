import { ReactNode } from "react";
import { SegurancaSidebar } from "./SegurancaSidebar";
import { SegurancaNavbar } from "./SegurancaNavbar";

interface SegurancaLayoutProps {
  children: ReactNode;
}

export function SegurancaLayout({ children }: SegurancaLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-muted/30">
      <SegurancaSidebar />
      <div className="flex-1 flex flex-col">
        <SegurancaNavbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
