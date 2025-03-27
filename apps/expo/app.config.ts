import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Nurim",
  slug: "nurim",
  scheme: "nurim",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon-light.png",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "io.pebbles.nurim",
    supportsTablet: true,
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      CFBundleLocalizations: ["en", "ko", "tr"],
      CFBundleDevelopmentRegion: "en",
    },
    icon: {
      light: "./assets/icon-light.png",
      dark: "./assets/icon-dark.png",
      // tinted: "",
    },
  },
  android: {
    package: "io.pebbles.nurim",
    adaptiveIcon: {
      foregroundImage: "./assets/icon-light.png",
      backgroundColor: "#1F104A",
    },
  },
  // extra: {
  //   eas: {
  //     projectId: "your-eas-project-id",
  //   },
  // },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "expo-localization",
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#E4E4E7",
        image: "./assets/icon-light.png",
        dark: {
          backgroundColor: "#18181B",
          image: "./assets/icon-dark.png",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          ccacheEnabled: true,
          privacyManifestAggregationEnabled: true,
        },
        android: {
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          minSdkVersion: 26,
        },
      },
    ],
    [
      "react-native-edge-to-edge",
      {
        android: {
          parentTheme: "Default",
          enforceNavigationBarContrast: false,
        },
      },
    ],
  ],
});
