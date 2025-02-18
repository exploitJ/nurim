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
      "react-native-bootsplash",
      {
        assetsDir: "assets/bootsplash",
        android: { parentTheme: "EdgeToEdge", darkContentBarsStyle: undefined },
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
