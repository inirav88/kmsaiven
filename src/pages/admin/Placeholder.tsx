import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "react-router";

const pageNames: Record<string, string> = {
  "/admin/properties": "Property Management",
  "/admin/properties/new": "Add Property",
  "/admin/projects": "Project Management",
  "/admin/projects/new": "Add Project",
  "/admin/leads": "Leads CRM",
  "/admin/requirements": "Buyer Requirements",
  "/admin/users": "Users & Roles",
  "/admin/homepage": "Homepage Builder",
  "/admin/appearance": "Appearance Settings",
  "/admin/integrations": "Integrations",
  "/admin/automation": "Automation Builder",
  "/admin/seo": "SEO Management",
  "/admin/reports": "Reports",
  "/admin/filters": "Filters Configuration",
  "/admin/settings": "Settings",
};

export default function PlaceholderPage() {
  const location = useLocation();
  const name = pageNames[location.pathname] || "Page";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#222120]" style={{ fontFamily: "var(--font-heading)" }}>
          {name}
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">This module is under development for Phase 2.</p>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F8F7F4] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚧</span>
          </div>
          <h3 className="text-lg font-medium text-[#222120] mb-2">Coming Soon</h3>
          <p className="text-sm text-[#6B6B6B] max-w-md mx-auto">
            The {name} module is being built. It will include all features specified in the requirements document.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
