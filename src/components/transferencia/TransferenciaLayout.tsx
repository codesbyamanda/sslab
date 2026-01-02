import { ReactNode } from "react";
import TransferenciaSidebar from "./TransferenciaSidebar";
import TransferenciaNavbar from "./TransferenciaNavbar";

interface TransferenciaLayoutProps {
  children: ReactNode;
  title?: string;
}

const TransferenciaLayout = ({ children, title }: TransferenciaLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <TransferenciaSidebar />
      <div className="flex-1 flex flex-col">
        <TransferenciaNavbar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default TransferenciaLayout;
