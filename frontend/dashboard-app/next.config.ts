// filepath: c:\Users\dietz\Desktop\Code\Dashboard\frontend\dashboard-app\next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Aktiviert den statischen Export
  trailingSlash: true, // Fügt einen Slash am Ende der URLs hinzu (für Netlify empfohlen)
};

export default nextConfig;
