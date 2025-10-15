import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { BlurView } from "expo-blur";
import CustomAppBar from "../components/CustomAppBar";
import CustomLoader from "../components/CustomLoader";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const authenticate = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const supported =
          await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (!hasHardware || supported.length === 0) {
          Alert.alert(
            "Error",
            "Tu dispositivo no soporta autenticación biométrica."
          );
          setIsAuthenticated(true);
          setIsChecking(false);
          return;
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Autenticación requerida",
          fallbackLabel: "Usar PIN o patrón",
          disableDeviceFallback: false,
        });

        setIsAuthenticated(result.success);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Ocurrió un error en la autenticación.");
      } finally {
        setIsChecking(false);
      }
    };

    authenticate();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar
        title="Home"
        actions={[
          {
            icon: "lock",
            onPress: () => navigation.navigate("Passwords"),
          },
        ]}
      />

      {isAuthenticated ? (
        <View style={styles.content}>
          <Text style={styles.text}>Bienvenido a tu HomeScreen 🔐</Text>
        </View>
      ) : (
        <BlurView intensity={60} tint="dark" style={styles.blurContainer}>
          {isChecking ? (
            <CustomLoader loading={isChecking} />
          ) : (
            <Text style={styles.text}>Autenticación fallida ❌</Text>
          )}
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
