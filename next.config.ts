import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Anciennes adresses du logo (le V doré de l'ancienne identité) → l'icône
   * officielle, synchronisée depuis vintoria-brand. Les caches des moteurs de
   * recherche et les liens déjà partagés mènent ainsi à la marque actuelle,
   * jamais à l'ancien logo ni à une 404.
   */
  async redirects() {
    return ["/vintoria-logo.webp", "/vintoria-logo.png", "/vintoria-mark.png"].map(
      (source) => ({ source, destination: "/marque/icon-512.png", permanent: true }),
    );
  },
};

export default nextConfig;
