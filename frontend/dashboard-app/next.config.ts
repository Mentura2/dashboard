import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Aktiviert den statischen Export
  trailingSlash: true, // Fügt einen Slash am Ende der URLs hinzu (für Netlify empfohlen)
  images: {
    unoptimized: true, // Deaktiviert die Bildoptimierung
  },
};

export default nextConfig;
