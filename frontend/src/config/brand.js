const env = import.meta.env;

export const brand = {
  name: env.VITE_BRAND_NAME || "Drip",
  legalName: env.VITE_BRAND_LEGAL_NAME || "Drip Clothing",
  email: env.VITE_BRAND_EMAIL || "hello@drip.example",
  whatsapp: env.VITE_BRAND_WHATSAPP || "+91 00000 00000",
  address: env.VITE_BRAND_ADDRESS || "Your business address",
  instagramHandle: env.VITE_BRAND_INSTAGRAM_HANDLE || "@drip",
  instagramUrl: env.VITE_BRAND_INSTAGRAM_URL || "https://www.instagram.com/drip/",
};
