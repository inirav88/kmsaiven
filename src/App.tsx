import { Routes, Route } from "react-router";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import PlaceholderPage from "./pages/admin/Placeholder";

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/properties" element={<PlaceholderPage />} />
        <Route path="/properties/new" element={<PlaceholderPage />} />
        <Route path="/projects" element={<PlaceholderPage />} />
        <Route path="/projects/new" element={<PlaceholderPage />} />
        <Route path="/leads" element={<PlaceholderPage />} />
        <Route path="/requirements" element={<PlaceholderPage />} />
        <Route path="/users" element={<PlaceholderPage />} />
        <Route path="/homepage" element={<PlaceholderPage />} />
        <Route path="/appearance" element={<PlaceholderPage />} />
        <Route path="/integrations" element={<PlaceholderPage />} />
        <Route path="/automation" element={<PlaceholderPage />} />
        <Route path="/seo" element={<PlaceholderPage />} />
        <Route path="/reports" element={<PlaceholderPage />} />
        <Route path="/filters" element={<PlaceholderPage />} />
        <Route path="/settings" element={<PlaceholderPage />} />
      </Routes>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
