/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/office",
  trailingSlash: true,
  distDir: "out",
  images: { unoptimized: true },
};

export default nextConfig;