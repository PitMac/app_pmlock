import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Image, Alert } from "react-native";
import { TextInput, Button, Card, Text, useTheme } from "react-native-paper";
import CustomPicker from "../components/CustomPicker";
import CustomAppBar from "../components/CustomAppBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PROVIDERS } from "../utils/providers";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PasswordFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { mode = "create", passwordData = null } = route.params || {};

  const [provider, setProvider] = useState(passwordData?.provider_id || null);
  const [username, setUsername] = useState(passwordData?.username || "");
  const [password, setPassword] = useState(passwordData?.password || "");
  const [note, setNote] = useState(passwordData?.note || "");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleSave = async () => {
    if (!provider || !username || !password) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }

    try {
      const stored = await AsyncStorage.getItem("passwords");
      const currentPasswords = stored ? JSON.parse(stored) : [];

      if (mode === "create") {
        const newPassword = {
          id: Date.now().toString(),
          provider_id: provider,
          username,
          password,
          note,
          created_at: new Date().toISOString(),
        };
        currentPasswords.push(newPassword);
        await AsyncStorage.setItem(
          "passwords",
          JSON.stringify(currentPasswords)
        );
        Alert.alert("¡Guardado!", "Contraseña creada correctamente.");
      } else {
        // Editar
        const updatedPasswords = currentPasswords.map((p) =>
          p.id === passwordData.id
            ? { ...p, provider_id: provider, username, password, note }
            : p
        );
        await AsyncStorage.setItem(
          "passwords",
          JSON.stringify(updatedPasswords)
        );
        Alert.alert("¡Guardado!", "Contraseña actualizada correctamente.");
      }

      navigation.goBack();
    } catch (e) {
      console.log("Error guardando contraseña:", e);
      Alert.alert("Error", "No se pudo guardar la contraseña.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Eliminar contraseña",
      "¿Estás seguro que deseas eliminar esta contraseña?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem("passwords");
              const currentPasswords = stored ? JSON.parse(stored) : [];

              const filtered = currentPasswords.filter(
                (p) => p.id !== passwordData.id
              );

              await AsyncStorage.setItem("passwords", JSON.stringify(filtered));
              Alert.alert("Eliminado", "Contraseña eliminada correctamente.");
              navigation.goBack();
            } catch (e) {
              console.log("Error eliminando contraseña:", e);
              Alert.alert("Error", "No se pudo eliminar la contraseña.");
            }
          },
        },
      ]
    );
  };

  const handleShowPassword = async () => {
    if (showPassword) {
      setShowPassword(false);
      return;
    }
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación requerida",
      });
      console.log(result);

      if (result.success) setShowPassword((prev) => !prev);
    } catch (e) {
      console.log("Error al autenticar:", e);
    }
  };

  const providerObj = PROVIDERS.find((p) => p.value === provider);

  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar
        showBackButton
        onBackPress={() => navigation.goBack()}
        title={mode === "create" ? "Nueva Contraseña" : "Editar Contraseña"}
        actions={
          mode === "edit"
            ? [
                {
                  icon: "delete", // icono del botón
                  onPress: handleDelete,
                },
              ]
            : []
        }
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Card style={styles.card}>
          <Card.Content>
            {mode === "create" ? (
              <CustomPicker
                items={PROVIDERS}
                onValueChange={setProvider}
                dropdownIconColor={theme.colors.onBackground}
                text={
                  provider
                    ? PROVIDERS.find((p) => p.value === provider)?.label
                    : "SELECCIONE UN PROVEEDOR"
                }
              />
            ) : (
              providerObj && (
                <View style={styles.providerContainer}>
                  {providerObj.logo && (
                    <Image
                      source={providerObj.logo}
                      style={styles.providerLogo}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.providerLabel}>{providerObj.label}</Text>
                </View>
              )
            )}

            <TextInput
              label="Usuario"
              mode="outlined"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />

            <TextInput
              label="Contraseña"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={handleShowPassword}
                />
              }
            />

            <TextInput
              label="Nota"
              mode="outlined"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
            >
              {mode === "create" ? "Crear" : "Guardar cambios"}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    paddingVertical: 10,
  },
  input: {
    marginTop: 10,
  },
  saveButton: {
    marginTop: 20,
  },
  providerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  providerLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  providerLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});
