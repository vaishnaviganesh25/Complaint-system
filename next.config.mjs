/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com"], // For Cloudinary images
  },
  experimental: {
    serverComponentsExternalPackages: ["cloudinary"],
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Handle static file serving
  trailingSlash: false,
};

export default nextConfig;
