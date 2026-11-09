/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Note: NEXT_PUBLIC_ variables are automatically available to the client.
  // We only need to define variables here that don't start with NEXT_PUBLIC_
  // or if we want to explicitly override them.
  env: {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
};

export default nextConfig;
