/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "starhire-uploader.s3.ap-southeast-2.amazonaws.com",
      "starhire-file-uploader.s3.ap-southeast-2.amazonaws.com",
    ],
  },
};

module.exports = nextConfig
