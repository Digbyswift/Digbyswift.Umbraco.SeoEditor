export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Digbyswift Umbracov 16Demo Dashboard Entrypoint",
    alias: "Digbyswift.Umbraco.v16.Demo.Dashboard.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
