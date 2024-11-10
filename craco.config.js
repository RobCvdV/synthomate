const path = require("path");
module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "src/components/core"),
      "@flow": path.resolve(__dirname, "src/components/flow"),
    },
  },
};
