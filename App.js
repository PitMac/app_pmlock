import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigation/StackNavigation";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";

const CombinedDefaultTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6750A4",
    secondary: "#03DAC6",
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#BB86FC",
    secondary: "#03DAC6",
    background: "#121212",
    surface: "#1E1E1E",
  },
};

export default function App() {
  const colorScheme = useColorScheme();
  console.log(colorScheme);

  const theme = CombinedDarkTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="light" />
      <NavigationContainer theme={theme}>
        <RootStack />
      </NavigationContainer>
    </PaperProvider>
  );
}
