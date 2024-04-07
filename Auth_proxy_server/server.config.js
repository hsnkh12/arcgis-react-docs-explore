module.exports = {
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || "localhost",
  },
  portalAuth: {
    username: process.env.PORTAL_AUTH_USERNAME || "admin",
    password: process.env.PORTAL_AUTH_PASSWORD || "admin",
    generateTokenUrl:
      process.env.PORTAL_AUTH_GENERATE_TOKEN_URL ||
      "https://www.arcgis.com/sharing/rest/generateToken",
  },
  client: {
    url: process.env.CLIENT_URL || "http://localhost:3000",
  }
};
