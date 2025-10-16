import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Image, Alert } from "react-native";
import { TextInput, Button, Card, Text, useTheme } from "react-native-paper";
import CustomPicker from "../components/CustomPicker";
import CustomAppBar from "../components/CustomAppBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PROVIDERS } from "../utils/providers";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert, { showAlert } from "../components/CustomAlert";
import GlobalIcon from "../components/GlobalIcon";

export default function PasswordFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { mode = "create", passwordData = null } = route.params || {};

  const [provider, setProvider] = useState(passwordData?.provider_id || null);
  const [customProviderName, setCustomProviderName] = useState(
    passwordData?.custom_provider_name || ""
  );
  const [username, setUsername] = useState(passwordData?.username || "");
  const [password, setPassword] = useState(passwordData?.password || "");
  const [note, setNote] = useState(passwordData?.note || "");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const renderLeftIcon = () => {
    const selectedProvider = PROVIDERS.find((p) => p.value === provider);

    if (selectedProvider?.logo) {
      return (
        <Image
          style={{
            width: 100,
            height: 100,
            alignSelf: "center",
            borderRadius: 20,
          }}
          source={selectedProvider.logo}
        />
      );
    }

    return (
      <View style={{ alignItems: "center" }}>
        <GlobalIcon color="white" family="fa5" name="lock" size={100} />
      </View>
    );
  };

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
          custom_provider_name: provider === "otro" ? customProviderName : null,
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
        showAlert({
          title: "¡Guardado!",
          message: "Contraseña creada correctamente.",
        });
      } else {
        const updatedPasswords = currentPasswords.map((p) =>
          p.id === passwordData.id
            ? {
                ...p,
                provider_id: provider,
                username,
                password,
                note,
                custom_provider_name:
                  provider === "otro" ? customProviderName : null,
              }
            : p
        );
        await AsyncStorage.setItem(
          "passwords",
          JSON.stringify(updatedPasswords)
        );
        showAlert({
          title: "¡Guardado!",
          message: "Contraseña actualizada correctamente.",
        });
      }

      navigation.goBack();
    } catch (e) {
      showAlert({
        title: "Error",
        message: "No se pudo guardar la contraseña.",
      });
    }
  };

  const handleDelete = async () => {
    showAlert({
      title: "Eliminar contraseña",
      message: "¿Estás seguro que deseas eliminar esta contraseña?",
      actions: [
        { label: "Cancelar", onPress: () => {} },
        {
          label: "Eliminar",
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem("passwords");
              const currentPasswords = stored ? JSON.parse(stored) : [];

              const filtered = currentPasswords.filter(
                (p) => p.id !== passwordData.id
              );
              const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Autenticación requerida",
              });

              if (result.success)
                await AsyncStorage.setItem(
                  "passwords",
                  JSON.stringify(filtered)
                );
              showAlert({
                title: "Eliminado",
                message: "Contraseña eliminada correctamente.",
              });
              navigation.goBack();
            } catch (e) {
              console.log("Error eliminando contraseña:", e);
              showAlert({
                title: "Error",
                message: "No se pudo eliminar la contraseña.",
              });
            }
          },
        },
      ],
    });
  };

  const handleShowPassword = async () => {
    if (showPassword) {
      setShowPassword(false);
      return;
    }
    if (mode === "create") {
      setShowPassword(true);
      return;
    }
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación requerida",
      });

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
                  icon: "delete",
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
        <Card style={[{ backgroundColor: theme.colors.surface }, styles.card]}>
          <View style={{ marginVertical: 10 }}>{renderLeftIcon()}</View>
          <Card.Content>
            <View>
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
              {provider === "otro" && (
                <TextInput
                  label="Nombre del proveedor"
                  mode="outlined"
                  value={customProviderName}
                  onChangeText={setCustomProviderName}
                  style={styles.input}
                  placeholder="Otro"
                />
              )}
            </View>

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
    alignItems: "center",
    marginBottom: 10,
  },
  providerLogo: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  providerLabel: {
    fontSize: 20,
    marginTop: 7,
    fontWeight: "bold",
  },
});
