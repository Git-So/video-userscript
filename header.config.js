const { defineTmHeader } = require("vite-plugin-tm-userscript");

const homepageURL = "https://github.com/Git-So/video-userscript";
const downloadURL =
  "https://raw.githubusercontent.com/Git-So/video-userscript/main/dist/video-userscript.user.js";

module.exports = defineTmHeader({
  name: "HTML5 视频增强脚本",
  namespace: homepageURL,
  author: "So",
  description: "脚本基于 Violentmonkey 开发，为 HTML5 视频，添加一些通用功能",
  grant: ["GM_addStyle"],
  match: ["http://*/*", "https://*/*"],
  updateURL: downloadURL,
  version: `${(new Date().valueOf() / 1000) | 0}`,
  downloadURL: downloadURL,
  homepageURL: homepageURL,
  supportURL: `${homepageURL}/issues`,
});
