import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigation/StackNavigation";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import CustomAlert from "./src/components/CustomAlert";

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
    primary: "#16476A",
    onPrimary: "#fff",
    secondary: "#3B9797",
    background: "#121212",
    surface: "#1E1E1E",
  },
};

export default function App() {
  const theme = CombinedDarkTheme;

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style="light" />
        <CustomAlert />
        <NavigationContainer theme={theme}>
          <RootStack />
        </NavigationContainer>
      </View>
    </PaperProvider>
  );
}
