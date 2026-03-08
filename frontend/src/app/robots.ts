import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://trademate.io").replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/simulation",
        "/account",
        "/inquiry",
        "/propensity",
        "/api",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
