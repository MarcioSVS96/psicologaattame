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
  // Adicione esta configuração para resolver o erro de URL inválida com Server Actions
  experimental: {
    serverActions: true,
  },
  // Adicione esta configuração para resolver o erro de URL inválida
  // com Server Actions em desenvolvimento.
  hostname: 'localhost',
}

export default nextConfig
