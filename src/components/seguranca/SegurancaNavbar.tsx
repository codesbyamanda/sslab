import { GlobalNavbar } from "@/components/shared/GlobalNavbar";

interface SegurancaNavbarProps {
  userName?: string;
}

export function SegurancaNavbar({ userName = "Ednaldo" }: SegurancaNavbarProps) {
  return <GlobalNavbar userName={userName} />;
}

export default SegurancaNavbar;
