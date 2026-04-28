import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  Users,
  Clock,
  Star,
  TrendingUp,
  HomeIcon,
  Key,
  Briefcase,
  Warehouse,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const navLinks = [
  { label: "Buy", href: "/buy", icon: HomeIcon },
  { label: "Rent", href: "/rent", icon: Key },
  { label: "Commercial", href: "/commercial", icon: Briefcase },
  { label: "PG", href: "/pg", icon: Users },
  { label: "Plots", href: "/plots", icon: Warehouse },
];

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "50+", label: "Cities Covered" },
  { value: "10,000+", label: "Happy Clients" },
  { value: "98%", label: "Satisfaction Rate" },
];

const featuredProperties = [
  {
    id: 1,
    title: "3 BHK Premium Flat",
    location: "Kudasan, Gandhinagar",
    price: "₹85 L",
    pricePerSqft: "₹4,250/sqft",
    area: "2,000 sqft",
    type: "Flat",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    tag: "Featured",
  },
  {
    id: 2,
    title: "Luxury Villa",
    location: "Sargasan, Gandhinagar",
    price: "₹2.5 Cr",
    pricePerSqft: "₹5,500/sqft",
    area: "4,500 sqft",
    type: "Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
    tag: "Premium",
  },
  {
    id: 3,
    title: "Commercial Office Space",
    location: "GIFT City, Gandhinagar",
    price: "₹1.2 Cr",
    pricePerSqft: "₹6,000/sqft",
    area: "2,000 sqft",
    type: "Office",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    tag: "Commercial",
  },
  {
    id: 4,
    title: "2 BHK Ready to Move",
    location: "Koba, Gandhinagar",
    price: "₹55 L",
    pricePerSqft: "₹4,000/sqft",
    area: "1,375 sqft",
    type: "Flat",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    tag: "Hot",
  },
];

const whyChooseUs = [
  { icon: Shield, title: "Verified Listings", desc: "Every property is verified by our expert team" },
  { icon: Users, title: "Expert Agents", desc: "500+ certified real estate professionals" },
  { icon: Clock, title: "24/7 Support", desc: "Round the clock assistance for all your needs" },
  { icon: MapPin, title: "Prime Locations", desc: "Access to the best localities in Gujarat" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#DC2125] flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <div className="text-base font-bold text-[#222120] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  Saiven Realty
                </div>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#6B6B6B] hover:text-[#DC2125] rounded-lg hover:bg-red-50 transition-all"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link to="/post-requirement" className="hidden sm:inline-flex">
                <Button variant="outline" className="border-[#DC2125] text-[#DC2125] hover:bg-[#DC2125] hover:text-white text-sm">
                  Post Requirement
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-[#222120] hover:bg-[#333] text-white text-sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#222120] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#222120] via-[#222120]/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#DC2125]/20 border border-[#DC2125]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#DC2125] animate-pulse" />
              <span className="text-sm text-red-200">#1 Real Estate Platform in Gujarat</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Find Your <span className="text-[#E9781D] italic">Dream</span> Property in Gujarat
            </h1>

            <p className="text-base sm:text-lg text-white/60 mb-8 leading-relaxed">
              Buy, sell, and rent residential and commercial properties across Gandhinagar, Ahmedabad & more. Verified listings, expert guidance.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl p-2 shadow-2xl max-w-xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg">
                  <Search className="w-4 h-4 text-[#9A9A9A]" />
                  <input
                    type="text"
                    placeholder="Search locality, project name..."
                    className="flex-1 bg-transparent text-sm text-[#222120] placeholder:text-[#9A9A9A] outline-none"
                  />
                </div>
                <Button className="bg-[#DC2125] hover:bg-[#B91C1F] text-white px-6 gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>

              {/* Search Tabs */}
              <div className="flex gap-1 mt-2 px-1">
                {["Buy", "Rent", "Commercial", "PG", "Plots"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${
                      tab === "Buy"
                        ? "bg-[#DC2125] text-white"
                        : "text-[#6B6B6B] hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular localities */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-white/40">Popular:</span>
              {["Kudasan", "Sargasan", "Koba", "GIFT City", "Raysan"].map((loc) => (
                <span
                  key={loc}
                  className="text-xs text-white/60 hover:text-[#E9781D] cursor-pointer transition-colors"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#F8F7F4] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#DC2125]">{stat.value}</div>
                <div className="text-sm text-[#6B6B6B] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#222120]" style={{ fontFamily: "var(--font-heading)" }}>
                Featured Properties
              </h2>
              <p className="text-sm text-[#6B6B6B] mt-1">Handpicked premium properties for you</p>
            </div>
            <Link to="/buy" className="hidden sm:flex items-center gap-1 text-sm text-[#DC2125] hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#DC2125] text-white text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {property.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-[#222120] text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {property.type}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-[#222120] text-sm mb-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-[#6B6B6B] mb-3">
                    <MapPin className="w-3 h-3" />
                    {property.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#DC2125]">{property.price}</span>
                    <span className="text-xs text-[#9A9A9A]">{property.area}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#222120]" style={{ fontFamily: "var(--font-heading)" }}>
              Why Choose <span className="text-[#DC2125]">Saiven Realty</span>?
            </h2>
            <p className="text-sm text-[#6B6B6B] mt-2">Trusted by thousands of happy homeowners</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChooseUs.map((item) => (
              <Card key={item.title} className="border-0 shadow-sm text-center p-6">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-[#DC2125]" />
                </div>
                <h3 className="font-semibold text-[#222120] mb-2">{item.title}</h3>
                <p className="text-sm text-[#6B6B6B]">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-[#222120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-medium text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Can't Find What You're Looking For?
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Post your requirement and let our experts find the perfect property for you. Free service, 24-hour response.
          </p>
          <Link to="/post-requirement">
            <Button className="bg-[#E9781D] hover:bg-[#D4691A] text-white px-8 py-3 text-base gap-2">
              Post Your Requirement <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#DC2125] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <span className="font-bold text-[#222120]" style={{ fontFamily: "var(--font-heading)" }}>Saiven Realty</span>
              </div>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Your trusted real estate partner in Gujarat. We help you find the perfect property that matches your dreams.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#222120] mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Buy Property", "Rent Property", "Commercial", "New Projects", "PG/Co-living"].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-[#6B6B6B] hover:text-[#DC2125] cursor-pointer transition-colors">{link}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#222120] mb-4">Company</h4>
              <ul className="space-y-2">
                {["About Us", "Contact", "Careers", "Blog", "Privacy Policy"].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-[#6B6B6B] hover:text-[#DC2125] cursor-pointer transition-colors">{link}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#222120] mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                  <MapPin className="w-4 h-4 text-[#DC2125]" />
                  Gandhinagar, Gujarat, India
                </li>
                <li className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                  <Phone className="w-4 h-4 text-[#DC2125]" />
                  +91-98765-43210
                </li>
                <li className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                  <Mail className="w-4 h-4 text-[#DC2125]" />
                  info@saivenrealty.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-10 pt-6 text-center">
            <p className="text-sm text-[#9A9A9A]">© 2025 Saiven Realty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
