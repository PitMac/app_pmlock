import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import PasswordsScreen from "../screens/PasswordsScreen";
import NewPasswordScreen from "../screens/NewPasswordScreen";
import GeneratePassword from "../screens/GeneratePassword";
import { useTheme } from "react-native-paper";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Passwords" component={PasswordsScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="Generate" component={GeneratePassword} />
    </Stack.Navigator>
  );
}
