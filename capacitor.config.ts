import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dream.interpreter",
  appName: "dream-interpreter",
  webDir: "build",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
};

export default config;
