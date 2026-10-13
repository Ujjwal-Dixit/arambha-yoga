/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Photos uploaded from the admin dashboard live in Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
