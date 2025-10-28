/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ribewmawyclwlknxsbah.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Removemos experimental.serverActions e hostname, pois causam warnings e não são mais necessários
}

export default nextConfig;
