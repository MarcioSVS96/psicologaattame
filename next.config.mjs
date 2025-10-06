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
}

export default nextConfig
