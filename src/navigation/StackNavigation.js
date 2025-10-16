import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import PasswordsScreen from "../screens/PasswordsScreen";
import NewPasswordScreen from "../screens/NewPasswordScreen";
import GeneratePassword from "../screens/GeneratePassword";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Passwords" component={PasswordsScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="Generate" component={GeneratePassword} />
    </Stack.Navigator>
  );
}
