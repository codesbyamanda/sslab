import { GlobalNavbar } from "@/components/shared/GlobalNavbar";

interface WorkspaceNavbarProps {
  title?: string;
  showExport?: boolean;
  userName?: string;
}

const WorkspaceNavbar = ({ userName = "Ednaldo" }: WorkspaceNavbarProps) => {
  return <GlobalNavbar userName={userName} />;
};

export default WorkspaceNavbar;
