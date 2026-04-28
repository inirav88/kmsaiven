import "dotenv/config";
import { getDb } from "../api/queries/connection";
import { siteConfig, homepageSections, users } from "./schema";

async function seed() {
  const db = getDb();

  // ── Seed Site Config (Saiven Realty branding) ──
  const defaultConfig = [
    // Colors
    { key: "color_primary", value: "#DC2125", type: "COLOR" as const, group: "colors" },
    { key: "color_primary_dark", value: "#B91C1F", type: "COLOR" as const, group: "colors" },
    { key: "color_secondary", value: "#222120", type: "COLOR" as const, group: "colors" },
    { key: "color_accent", value: "#E9781D", type: "COLOR" as const, group: "colors" },
    { key: "color_background", value: "#FFFFFF", type: "COLOR" as const, group: "colors" },
    { key: "color_surface", value: "#F8F7F4", type: "COLOR" as const, group: "colors" },
    { key: "color_text_primary", value: "#222120", type: "COLOR" as const, group: "colors" },
    { key: "color_text_secondary", value: "#6B6B6B", type: "COLOR" as const, group: "colors" },
    { key: "color_text_muted", value: "#9A9A9A", type: "COLOR" as const, group: "colors" },

    // Typography
    { key: "font_heading", value: "Playfair Display", type: "STRING" as const, group: "typography" },
    { key: "font_body", value: "DM Sans", type: "STRING" as const, group: "typography" },
    { key: "font_base_size", value: "16", type: "STRING" as const, group: "typography" },

    // Brand
    { key: "brand_name", value: "Saiven Realty", type: "STRING" as const, group: "brand" },
    { key: "brand_tagline", value: "Your Trusted Real Estate Partner", type: "STRING" as const, group: "brand" },
    { key: "logo_url", value: "", type: "FILE" as const, group: "brand" },
    { key: "favicon_url", value: "", type: "FILE" as const, group: "brand" },

    // Header
    { key: "header_style", value: "solid", type: "STRING" as const, group: "header" },
    { key: "header_cta_label", value: "Post Requirement", type: "STRING" as const, group: "header" },
    { key: "header_cta_url", value: "/post-requirement", type: "STRING" as const, group: "header" },

    // Footer
    { key: "footer_tagline", value: "Saiven Realty - Building Trust, Delivering Homes since 2015.", type: "STRING" as const, group: "footer" },
    { key: "footer_copyright", value: "© 2025 Saiven Realty. All rights reserved.", type: "STRING" as const, group: "footer" },

    // Social
    { key: "social_facebook", value: "", type: "STRING" as const, group: "social" },
    { key: "social_instagram", value: "", type: "STRING" as const, group: "social" },
    { key: "social_linkedin", value: "", type: "STRING" as const, group: "social" },
    { key: "social_youtube", value: "", type: "STRING" as const, group: "social" },
    { key: "social_whatsapp", value: "", type: "STRING" as const, group: "social" },
    { key: "social_twitter", value: "", type: "STRING" as const, group: "social" },

    // Contact
    { key: "contact_phone", value: "+91-98765-43210", type: "STRING" as const, group: "contact" },
    { key: "contact_email", value: "info@saivenrealty.com", type: "STRING" as const, group: "contact" },
    { key: "contact_address", value: "Saiven Realty, Gandhinagar, Gujarat, India", type: "STRING" as const, group: "contact" },
    { key: "contact_whatsapp", value: "+919876543210", type: "STRING" as const, group: "contact" },

    // Integrations (placeholder)
    { key: "ga_measurement_id", value: "", type: "STRING" as const, group: "integrations" },
    { key: "gtm_container_id", value: "", type: "STRING" as const, group: "integrations" },

    // Search
    { key: "search_page_size", value: "24", type: "STRING" as const, group: "search" },
    { key: "card_style_default", value: "classic", type: "STRING" as const, group: "search" },

    // Auth
    { key: "auth_allow_register", value: "true", type: "BOOLEAN" as const, group: "auth" },
    { key: "auth_allow_google", value: "true", type: "BOOLEAN" as const, group: "auth" },
    { key: "auth_allow_facebook", value: "false", type: "BOOLEAN" as const, group: "auth" },
    { key: "auth_allow_email_otp", value: "false", type: "BOOLEAN" as const, group: "auth" },
    { key: "auth_allow_mobile_otp", value: "false", type: "BOOLEAN" as const, group: "auth" },
  ];

  for (const config of defaultConfig) {
    await db.insert(siteConfig)
      .values(config)
      .onDuplicateKeyUpdate({ set: { value: config.value, updatedAt: new Date() } });
  }

  // ── Seed Homepage Sections ──
  const defaultSections = [
    {
      type: "HERO_BANNER" as const,
      title: "Find Your Dream Property",
      subtitle: "Buy, Rent & Sell Properties in Gandhinagar & Ahmedabad",
      order: 1,
      config: {
        backgroundImage: "",
        overlayOpacity: 0.6,
        ctaLabel: "Explore Properties",
        ctaUrl: "/buy",
        secondaryCtaLabel: "Post Requirement",
        secondaryCtaUrl: "/post-requirement",
      },
      isEnabled: true,
    },
    {
      type: "SEARCH_BAR" as const,
      title: "",
      subtitle: "",
      order: 2,
      config: {
        tabs: ["Buy", "Rent", "Commercial", "PG", "Plots"],
        defaultTab: "Buy",
        popularLocalities: ["Kudasan", "Sargasan", "Koba", "GIFT City", "Raysan", "Infocity"],
      },
      isEnabled: true,
    },
    {
      type: "FEATURED_PROPERTIES" as const,
      title: "Featured Properties",
      subtitle: "Hand-picked premium properties for you",
      order: 3,
      config: {
        layout: "grid",
        maxCards: 6,
        filterType: "auto",
        cardStyle: "classic",
      },
      isEnabled: true,
    },
    {
      type: "FEATURED_PROJECTS" as const,
      title: "Featured Projects",
      subtitle: "Upcoming and ongoing residential & commercial projects",
      order: 4,
      config: {
        layout: "grid",
        maxCards: 4,
        filterType: "auto",
        cardStyle: "standard",
      },
      isEnabled: true,
    },
    {
      type: "BUYER_CTA" as const,
      title: "Can't Find What You're Looking For?",
      subtitle: "Post your requirement and let our experts find the perfect property for you.",
      order: 5,
      config: {
        backgroundImage: "",
        ctaLabel: "Post Your Requirement",
        ctaUrl: "/post-requirement",
        backgroundColor: "#222120",
        textColor: "#FFFFFF",
      },
      isEnabled: true,
    },
    {
      type: "WHY_CHOOSE_US" as const,
      title: "Why Choose Saiven Realty?",
      subtitle: "Trusted by thousands of happy homeowners",
      order: 6,
      config: {
        cards: [
          { icon: "Shield", title: "Verified Listings", description: "Every property is verified by our team" },
          { icon: "Users", title: "Expert Agents", description: "500+ certified real estate professionals" },
          { icon: "Clock", title: "24/7 Support", description: "Round the clock assistance for you" },
          { icon: "MapPin", title: "Prime Locations", description: "Access to the best localities in Gujarat" },
        ],
      },
      isEnabled: true,
    },
    {
      type: "STATISTICS" as const,
      title: "",
      subtitle: "",
      order: 7,
      config: {
        stats: [
          { value: "500+", label: "Properties Listed" },
          { value: "50+", label: "Cities Covered" },
          { value: "10,000+", label: "Happy Clients" },
          { value: "98%", label: "Client Satisfaction" },
        ],
      },
      isEnabled: true,
    },
    {
      type: "TESTIMONIALS" as const,
      title: "What Our Clients Say",
      subtitle: "Real stories from real customers",
      order: 8,
      config: { autoPlay: true, interval: 5 },
      isEnabled: true,
    },
    {
      type: "BLOG" as const,
      title: "Latest News & Insights",
      subtitle: "Stay updated with the real estate market",
      order: 9,
      config: { maxPosts: 3, category: "all" },
      isEnabled: true,
    },
  ];

  for (const section of defaultSections) {
    await db.insert(homepageSections)
      .values(section)
      .onDuplicateKeyUpdate({ set: { isEnabled: section.isEnabled, updatedAt: new Date() } });
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
