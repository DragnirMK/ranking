const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.SETUP_URL || "http://localhost:3001",
      changeOrigin: true,
    })
  );
};
