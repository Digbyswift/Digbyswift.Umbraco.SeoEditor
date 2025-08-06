import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/suggestions-property-editor-ui.element.ts",
      formats: ["es"],
      fileName: "suggestions-property-editor-ui.element",
    },
    outDir: "../wwwroot/App_Plugins/DemoPropertyEditor", // your web component will be saved in this location
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco/],
    },
  },
});
