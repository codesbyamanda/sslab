import { GlobalNavbar } from "@/components/shared/GlobalNavbar";

interface FaturamentoNavbarProps {
  userName?: string;
}

const FaturamentoNavbar = ({ userName = "Ednaldo" }: FaturamentoNavbarProps) => {
  return <GlobalNavbar userName={userName} />;
};

export default FaturamentoNavbar;
