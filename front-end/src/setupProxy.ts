const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: any) {
  app.use(
    '/api',  // Redirige toutes les requêtes commençant par /api
    createProxyMiddleware({
      target: 'http://localhost:8000',  // L'API Django tourne sur ce port
      changeOrigin: true,
    })
  );
};
