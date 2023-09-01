/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    server: {
      host: '0.0.0.0', // Set your desired host (e.g., '0.0.0.0' for all available network interfaces)
      port: process.env.PORT || 3001, // Set the port you want to use (or use an environment variable)
    },
    // Other Next.js configuration options here...
  }