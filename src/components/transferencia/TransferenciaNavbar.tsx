import { GlobalNavbar } from "@/components/shared/GlobalNavbar";

interface TransferenciaNavbarProps {
  title?: string;
  userName?: string;
}

const TransferenciaNavbar = ({ userName = "Ednaldo" }: TransferenciaNavbarProps) => {
  return <GlobalNavbar userName={userName} />;
};

export default TransferenciaNavbar;
