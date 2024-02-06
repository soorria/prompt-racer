/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/src",
        destination: "https://github.com/soorria/prompt-racer",
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
