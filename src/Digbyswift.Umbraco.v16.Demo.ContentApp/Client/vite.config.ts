import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
          entry: "src/demo-workspace.ts", // Bundle registers one or more manifests
      formats: ["es"],
      fileName: "demo-workspace",
    },
    outDir: "../wwwroot/App_Plugins/DemoWorkspace", // your web component will be saved in this location
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco/],
    },
  },
});