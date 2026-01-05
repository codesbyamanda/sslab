import { ReactNode } from "react";
import TransferenciaSidebar from "./TransferenciaSidebar";
import TransferenciaNavbar from "./TransferenciaNavbar";

interface TransferenciaLayoutProps {
  children: ReactNode;
  title?: string;
}

const TransferenciaLayout = ({ children }: TransferenciaLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <TransferenciaSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TransferenciaNavbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default TransferenciaLayout;
