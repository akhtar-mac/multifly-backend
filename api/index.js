// Vercel serverless entry point
const app = require("../server");

module.exports = (req, res) => {
  return app(req, res);
};
