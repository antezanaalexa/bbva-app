import DashboardShell from "../components/dashboard/DashboardShell";
import { useAuth } from "../context/AuthContext";

export default function PageShell({ title, children }) {
  const { user } = useAuth();

  const nombreUsuario =
    user?.user_metadata?.nombres || user?.email?.split("@")[0] || "Cliente";

  return (
    <DashboardShell title={title} nombreUsuario={nombreUsuario}>
      {children}
    </DashboardShell>
  );
}