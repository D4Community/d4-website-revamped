import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.d4community.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/studio"],
      },

      {
        userAgent: [
          // OpenAI
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",

          // Anthropic
          "ClaudeBot",
          "Claude-Web",

          // Perplexity
          "PerplexityBot",

          // Google AI
          "Google-Extended",

          // Microsoft
          "Bingbot",
          "MicrosoftPreview",
          "CopilotBot",

          // Apple
          "Applebot",

          // Meta
          "Meta-ExternalAgent",
          "meta-externalagent",

          // Amazon
          "Amazonbot",

          // Common AI crawlers
          "Bytespider",         
          "CCBot",              
          "Diffbot",
          "YouBot",
          "ImagesiftBot",

          // AI Search
          "AndiBot",
          "PhindBot",

          // Search Engines
          "Googlebot",
          "Googlebot-News",
          "Googlebot-Image",
          "Googlebot-Video",
          "AdsBot-Google",
          "BingPreview",
          "DuckDuckBot",
          "YandexBot",
          "YandexImages",
          "Baiduspider",
          "Sogou",
          "PetalBot",
          "SeznamBot",
        ],
        allow: "/",
        disallow: ["/admin", "/studio"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}