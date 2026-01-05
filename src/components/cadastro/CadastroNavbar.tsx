import { GlobalNavbar } from "@/components/shared/GlobalNavbar";

interface CadastroNavbarProps {
  userName?: string;
}

export function CadastroNavbar({ userName = "Ednaldo" }: CadastroNavbarProps) {
  return <GlobalNavbar userName={userName} />;
}

export default CadastroNavbar;
