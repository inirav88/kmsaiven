import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Users,
  Settings,
  Palette,
  Home,
  Megaphone,
  Plug,
  Cog,
  Search,
  BarChart3,
  Shield,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Receipt,
} from "lucide-react";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Building2, label: "Properties", path: "/admin/properties" },
  { icon: FolderKanban, label: "Projects", path: "/admin/projects" },
  { icon: Megaphone, label: "Leads CRM", path: "/admin/leads" },
  { icon: Receipt, label: "Requirements", path: "/admin/requirements" },
  { icon: Users, label: "Users & Roles", path: "/admin/users" },
  { icon: Home, label: "Homepage Builder", path: "/admin/homepage" },
  { icon: Palette, label: "Appearance", path: "/admin/appearance" },
  { icon: Plug, label: "Integrations", path: "/admin/integrations" },
  { icon: Cog, label: "Automation", path: "/admin/automation" },
  { icon: Search, label: "SEO", path: "/admin/seo" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Shield, label: "Filters Config", path: "/admin/filters" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdminRoute = location.pathname.startsWith("/admin");
  if (!isAdminRoute) return <>{children}</>;

  return (
    <div className="flex h-screen bg-[#F8F7F4]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#222120] text-white transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-white/10 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#DC2125] flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
                  Saiven Realty
                </div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Admin Panel</div>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-full bg-[#DC2125] flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-[#DC2125] text-white font-medium"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-3 border-t border-white/10 text-white/40 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* User section */}
        <div className={`p-4 border-t border-white/10 ${collapsed ? "text-center" : ""}`}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#DC2125]/20 flex items-center justify-center text-xs font-medium">
                {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{user?.name ?? "Admin"}</div>
                <div className="text-[10px] text-white/40 capitalize">{user?.role ?? "admin"}</div>
              </div>
              <button onClick={logout} className="text-white/40 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          {collapsed && (
            <button onClick={logout} className="text-white/40 hover:text-white transition-colors">
              <LogOut className="w-4 h-4 mx-auto" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#222120] text-white h-14 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-[#222120] text-white p-0">
              <div className="flex items-center h-16 px-4 border-b border-white/10">
                <Link to="/admin" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#DC2125] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                      Saiven Realty
                    </div>
                  </div>
                </Link>
              </div>
              <nav className="py-4">
                {adminNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-[#DC2125] text-white font-medium"
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="w-[18px] h-[18px]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Saiven Realty
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:h-screen">
        <div className="lg:p-8 pt-16 lg:pt-8 p-4 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
