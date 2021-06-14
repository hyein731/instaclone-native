import AppLoading from "expo-app-loading";
import React, { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { NavigationContainer, ThemeProvider } from "@react-navigation/native";
import { AppearanceProvider, Appearance } from "react-native-appearance";

export default function App() {
  const [loading, setLoading] = useState(true);

  const onFinish = () => {
    setLoading(false);
  };

  const preload = () => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    const imagesToLoad = [
      require("./assets/logo.png"),
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png",
    ]
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    return Promise.all([...fontPromises, ...imagePromises]);
  };

  if (loading) {
    return (
      <AppLoading
        startAsync={preload}
        onError={console.warn}
        onFinish={onFinish}
      />
    );
  }

  // const light = Appearance.getColorScheme() === "light";
  const subscription = Appearance.addChangeListener(({ colorScheme }) => {
    console.log(colorScheme); // dark
  });
  return (
    <AppearanceProvider>
      {/* <ThemeProvider theme={light? lightTheme : darkTheme}> */}
        <NavigationContainer>
          <LoggedOutNav />
        </NavigationContainer>
      {/* </ThemeProvider> */}
    </AppearanceProvider>
  );
}
