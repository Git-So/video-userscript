const { defineTmHeader } = require("vite-plugin-tm-userscript");

module.exports = defineTmHeader({
  name: "Video Userscript",
  namespace: "site.sooo.userscript.video",
  author: "So",
  description: "HTML5 视频增强脚本",
  version: `${(new Date().valueOf() / 1000) | 0}`,
  grant: ["GM_addStyle"],
});
