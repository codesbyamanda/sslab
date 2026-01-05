import { GlobalNavbar } from "@/components/shared/GlobalNavbar";

interface LaboratorioNavbarProps {
  title?: string;
  showSearch?: boolean;
  userName?: string;
}

const LaboratorioNavbar = ({ userName = "Ednaldo" }: LaboratorioNavbarProps) => {
  return <GlobalNavbar userName={userName} />;
};

export default LaboratorioNavbar;
