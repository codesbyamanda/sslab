import { GlobalNavbar } from "@/components/shared/GlobalNavbar";

interface FinanceiroNavbarProps {
  userName?: string;
}

const FinanceiroNavbar = ({ userName = "Ednaldo" }: FinanceiroNavbarProps) => {
  return <GlobalNavbar userName={userName} />;
};

export default FinanceiroNavbar;
