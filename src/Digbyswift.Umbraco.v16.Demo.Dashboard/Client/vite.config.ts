import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/bundle.manifests.ts", // Bundle registers one or more manifests
      formats: ["es"],
      fileName: "digbyswift-umbraco-v-16-demo-dashboard",
    },
    outDir: "../wwwroot/App_Plugins/DigbyswiftUmbracov16DemoDashboard", // your web component will be saved in this location
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco/],
    },
  },
});
