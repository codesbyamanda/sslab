import { GlobalNavbar } from "@/components/shared/GlobalNavbar";

interface AtendimentoNavbarProps {
  userName?: string;
}

const AtendimentoNavbar = ({ userName = "Ednaldo" }: AtendimentoNavbarProps) => {
  return <GlobalNavbar userName={userName} />;
};

export default AtendimentoNavbar;
