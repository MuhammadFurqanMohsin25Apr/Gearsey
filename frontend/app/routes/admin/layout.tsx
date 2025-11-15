import { Outlet, useNavigate } from "react-router";
import { AppSidebar } from "~/components/admin/app-sidebar";
import AdminNavbar from "~/components/admin/navbar";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { useSession } from "~/lib/auth-client";
import { useEffect } from "react";

export default function AdminLayout() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const user = session?.user;

  useEffect(() => {
    // Redirect to login if not authenticated or not an admin
    if (!user || user.role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Show nothing while checking auth
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-gray-50">
        <AdminNavbar />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
