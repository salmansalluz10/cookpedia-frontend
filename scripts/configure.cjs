const fs = require("fs");
const path = require("path");
const apiUrl =
  process.env.API_URL || "https://cookpedia-server-8mz5.onrender.com";
const url = new URL(apiUrl);
if (
  !["http:", "https:"].includes(url.protocol) ||
  url.username ||
  url.password ||
  url.search ||
  url.hash
)
  throw new Error(
    "API_URL must be an HTTP(S) backend URL without credentials, query, or fragment.",
  );
fs.writeFileSync(
  path.join(__dirname, "../public/config.js"),
  "window.COOKPEDIA_CONFIG = " +
    JSON.stringify({ apiUrl: apiUrl.replace(/\/$/, "") }) +
    ";\n",
);
console.log("Public API configuration generated.");
