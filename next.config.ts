import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite verificar um build sem interferir no servidor de desenvolvimento (NEXT_DIST_DIR=.next-verify).
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
