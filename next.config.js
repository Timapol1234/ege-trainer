/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем строгий режим для better-sqlite3
  reactStrictMode: false,
  
  // Разрешаем доступ с других доменов
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // Настройки webpack для работы с нативными модулями
  webpack: (config, { isServer }) => {
    // На клиенте отключаем fs и другие нативные модули
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        os: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Экспериментальные настройки
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  
  // Настройки для API routes
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },

  // Для production деплоя
  output: 'standalone',
  trailingSlash: true,
}

module.exports = nextConfig