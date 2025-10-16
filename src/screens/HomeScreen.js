import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import CustomAppBar from "../components/CustomAppBar";
import CustomLoader from "../components/CustomLoader";
import { MOCK_PASSWORDS } from "../utils/passwords";
import GlobalIcon from "../components/GlobalIcon";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [passwordCount, setPasswordCount] = useState(0);

  const loadPasswords = async () => {
    try {
      const stored = await AsyncStorage.getItem("passwords");
      const passwords = stored ? JSON.parse(stored) : [];
      setPasswordCount(passwords.length);
    } catch (e) {
      console.log("Error cargando contraseñas:", e);
    }
  };

  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    loadPasswords();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadPasswords();
    }, [])
  );

  useEffect(() => {
    const authenticate = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const supported =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!isEnrolled) {
          alert("No tienes biometría o bloqueo de pantalla configurado.");
          return;
        }

        if (!hasHardware || supported.length === 0) {
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
        alert("Ocurrió un error en la autenticación.");
      } finally {
        setIsChecking(false);
      }
    };

    authenticate();
  }, []);
  const menuItems = [
    {
      title: "Mis contraseñas",
      subtitle: `${passwordCount} guardadas`,
      icon: { family: "fa5", name: "lock" }, // FontAwesome5
      color: "#4CAF50",
      screen: "Passwords",
    },
    {
      title: "Generar",
      subtitle: "Crea contraseñas seguras",
      icon: { family: "materialC", name: "key-plus" }, // MaterialCommunityIcons
      color: "#2196F3",
      screen: "Generate",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CustomAppBar title="Inicio" />

      {isAuthenticated ? (
        <View style={styles.container}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.cardWrapper}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <View style={[styles.card, { borderLeftColor: item.color }]}>
                {/* Icono con fondo redondeado */}
                <View
                  style={{
                    backgroundColor: item.color,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <GlobalIcon
                    family={item.icon.family}
                    name={item.icon.name}
                    size={24}
                    color="#fff"
                  />
                </View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
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
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    gap: 20,
  },
  cardWrapper: {
    width: "45%",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 6,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 140,
  },
  icon: {
    fontSize: 36,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#ccc",
    marginTop: 4,
    textAlign: "center",
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
