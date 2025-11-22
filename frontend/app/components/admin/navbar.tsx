import { LogOut, Settings, Shield, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { authClient, useSession } from "~/lib/auth-client";

export default function AdminNavbar() {
  const { data } = useSession();
  const user = data?.user;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  if (!user) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu */}
          <SidebarTrigger />

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {settingsOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      navigate("/admin-profile");
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                  </button>

                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      // Navigate to settings page when created
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </button>

                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      // Navigate to security page when created
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Security
                  </button>

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        authClient.signOut();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name[0] || "A"}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
