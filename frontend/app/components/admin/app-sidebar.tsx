import { NavLink } from "react-router";
import {
  TrendingUp,
  Package,
  Star,
  Clock,
  Users,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import clsx from "clsx";

type TabType =
  | "overview"
  | "products"
  | "auctions"
  | "users"
  | "orders"
  | "reviews";

export function AppSidebar() {
  const navItems = [
    { id: "products" as TabType, label: "Products", icon: Package },
    { id: "reviews" as TabType, label: "Reviews", icon: Star },
    { id: "auctions" as TabType, label: "Auctions", icon: Clock },
    { id: "users" as TabType, label: "Users", icon: Users },
    { id: "orders" as TabType, label: "Orders", icon: ShoppingBag },
    { id: "payments" as TabType, label: "Payments", icon: DollarSign },
  ];

  return (
    <>
      <Sidebar className="bg-white border-r border-gray-100">
        <SidebarContent>
          {/* Navigation Group */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 mb-4 tracking-wider">
              <NavLink to="/admin" className="text-2xl flex-1 text-center text-red-600 hover:text-red-700 font-bold normal-case">
                Gearsey
              </NavLink>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <NavLink
                        to={`/admin/${item.id}`}
                        children={({ isActive }) => (
                          <SidebarMenuButton
                            isActive={isActive}
                            asChild
                            className={clsx(
                              "flex items-center gap-3 px-3 py-6 rounded-md font-medium transition-all duration-200",
                              isActive
                                ? "bg-linear-to-r! from-red-600! to-red-700! text-white! shadow-sm!"
                                : "text-gray-700! hover:bg-gray-100! hover:text-gray-900!"
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <Icon className="w-5 h-5 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </span>
                          </SidebarMenuButton>
                        )}
                      />
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Stats Group */}
        </SidebarContent>
      </Sidebar>
    </>
  );
}
