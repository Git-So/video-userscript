import { defineConfig } from "vite";
import UserScriptPlugin from "vite-plugin-tm-userscript";

export default defineConfig({
  build: {
    lib: {
      entry: "scr/main.ts",
      formats: ["umd"],
      name: "video-userscript",
    },
  },
  plugins: [UserScriptPlugin()],
});
