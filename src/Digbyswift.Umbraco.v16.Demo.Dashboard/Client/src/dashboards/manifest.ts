export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Digbyswift Umbracov 16Demo Dashboard Dashboard",
    alias: "Digbyswift.Umbraco.v16.Demo.Dashboard.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element.js"),
    meta: {
      label: "Example Dashboard",
      pathname: "example-dashboard",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content",
      },
    ],
  },
];
