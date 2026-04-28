import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  FolderKanban,
  Megaphone,
  Users,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  Receipt,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for dashboard - in production, these come from API
const monthlyEnquiries = [
  { month: "Jan", enquiries: 45 },
  { month: "Feb", enquiries: 62 },
  { month: "Mar", enquiries: 78 },
  { month: "Apr", enquiries: 55 },
  { month: "May", enquiries: 89 },
  { month: "Jun", enquiries: 102 },
  { month: "Jul", enquiries: 95 },
  { month: "Aug", enquiries: 120 },
  { month: "Sep", enquiries: 110 },
  { month: "Oct", enquiries: 135 },
  { month: "Nov", enquiries: 128 },
  { month: "Dec", enquiries: 150 },
];

const propertyTypeData = [
  { name: "Flats", value: 45, color: "#DC2125" },
  { name: "Villas", value: 20, color: "#E9781D" },
  { name: "Plots", value: 18, color: "#222120" },
  { name: "Commercial", value: 12, color: "#6B6B6B" },
  { name: "Others", value: 5, color: "#9A9A9A" },
];

const leadPipeline = [
  { stage: "New", count: 32, color: "#DC2125" },
  { stage: "Contacted", count: 28, color: "#E9781D" },
  { stage: "Qualified", count: 20, color: "#222120" },
  { stage: "Site Visit", count: 15, color: "#6B6B6B" },
  { stage: "Negotiation", count: 10, color: "#4CAF50" },
  { stage: "Converted", count: 8, color: "#2E7D32" },
];

const recentLeads = [
  { id: 1, name: "Rahul Sharma", type: "PROPERTY_ENQUIRY", source: "Website", status: "NEW", time: "2 min ago", property: "3BHK Flat in Kudasan" },
  { id: 2, name: "Priya Patel", type: "BUYER_REQUIREMENT", source: "WhatsApp", status: "CONTACTED", time: "15 min ago", property: "2BHK Budget 75L" },
  { id: 3, name: "Amit Kumar", type: "BROCHURE_DOWNLOAD", source: "Housing.com", status: "QUALIFIED", time: "1 hr ago", property: "Saiven Heights" },
  { id: 4, name: "Neha Gupta", type: "PROJECT_ENQUIRY", source: "Instagram", status: "NEW", time: "2 hrs ago", property: "GIFT City Commercial" },
  { id: 5, name: "Vikram Shah", type: "SITE_VISIT_REQUEST", source: "Walk-in", status: "SITE_VISIT_SCHEDULED", time: "3 hrs ago", property: "Villa in Sargasan" },
];

const statusColors: Record<string, string> = {
  NEW: "bg-red-100 text-red-700",
  CONTACTED: "bg-orange-100 text-orange-700",
  QUALIFIED: "bg-blue-100 text-blue-700",
  SITE_VISIT_SCHEDULED: "bg-purple-100 text-purple-700",
  CONVERTED: "bg-green-100 text-green-700",
};

const statCards = [
  {
    title: "Total Properties",
    value: "245",
    change: "+12%",
    trend: "up",
    icon: Building2,
    color: "bg-red-50 text-[#DC2125]",
  },
  {
    title: "Active Projects",
    value: "18",
    change: "+3",
    trend: "up",
    icon: FolderKanban,
    color: "bg-orange-50 text-[#E9781D]",
  },
  {
    title: "Total Leads",
    value: "1,284",
    change: "+8.5%",
    trend: "up",
    icon: Megaphone,
    color: "bg-gray-100 text-[#222120]",
  },
  {
    title: "Team Members",
    value: "24",
    change: "+2",
    trend: "up",
    icon: Users,
    color: "bg-red-50 text-[#DC2125]",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#222120]" style={{ fontFamily: "var(--font-heading)" }}>
            Dashboard
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/properties/new">
            <Button className="bg-[#DC2125] hover:bg-[#B91C1F] text-white gap-2">
              <Plus className="w-4 h-4" /> Add Property
            </Button>
          </Link>
          <Link to="/admin/projects/new">
            <Button variant="outline" className="border-[#222120] text-[#222120] hover:bg-[#222120] hover:text-white gap-2">
              <Plus className="w-4 h-4" /> Add Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-[#6B6B6B]">{card.title}</p>
                  <p className="text-2xl font-bold text-[#222120]">{card.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {card.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={card.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {card.change}
                    </span>
                    <span className="text-[#9A9A9A]">vs last month</span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Enquiries */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#222120]">
              Monthly Enquiries Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyEnquiries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9A9A9A" }} />
                <YAxis tick={{ fontSize: 12, fill: "#9A9A9A" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="enquiries"
                  stroke="#DC2125"
                  strokeWidth={2}
                  dot={{ fill: "#DC2125", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Properties by Type */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#222120]">
              Properties by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {propertyTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-[#6B6B6B]">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Pipeline & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lead Pipeline */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#222120]">
              Lead Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leadPipeline} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#9A9A9A" }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: "#6B6B6B" }} width={90} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#DC2125" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#222120]">
              Recent Leads
            </CardTitle>
            <Link to="/admin/leads" className="text-xs text-[#DC2125] hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F8F7F4] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-[#222120]">
                      {lead.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#222120] truncate">{lead.name}</span>
                      <Badge variant="secondary" className={`text-[10px] ${statusColors[lead.status] ?? "bg-gray-100"}`}>
                        {lead.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">{lead.property}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[#9A9A9A]">{lead.source}</span>
                      <span className="text-[10px] text-[#9A9A9A]">·</span>
                      <span className="text-[10px] text-[#9A9A9A]">{lead.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Views This Week", value: "3,420", icon: Eye, change: "+15%" },
          { label: "Avg. Response Time", value: "2.4 hrs", icon: TrendingUp, change: "-10%" },
          { label: "Conversion Rate", value: "6.8%", icon: ArrowUpRight, change: "+1.2%" },
          { label: "Pending Follow-ups", value: "23", icon: Receipt, change: "5 due today" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-[#6B6B6B] mb-2">
              <stat.icon className="w-4 h-4" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-lg font-semibold text-[#222120]">{stat.value}</span>
              <span className="text-xs text-green-600">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
