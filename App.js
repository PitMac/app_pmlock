import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigation/StackNavigation";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </PaperProvider>
  );
}
