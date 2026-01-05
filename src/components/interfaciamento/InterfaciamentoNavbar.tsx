import { GlobalNavbar } from "@/components/shared/GlobalNavbar";

interface InterfaciamentoNavbarProps {
  userName?: string;
  showSearch?: boolean;
}

export function InterfaciamentoNavbar({ userName = "Ednaldo" }: InterfaciamentoNavbarProps) {
  return <GlobalNavbar userName={userName} />;
}

export default InterfaciamentoNavbar;
