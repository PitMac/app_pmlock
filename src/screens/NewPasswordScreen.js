import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import CustomPicker from "../components/CustomPicker";
import CustomAppBar from "../components/CustomAppBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PROVIDERS } from "../utils/providers";
import * as LocalAuthentication from "expo-local-authentication";

export default function PasswordFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { mode = "create", passwordData = null } = route.params || {};

  const [provider, setProvider] = useState(passwordData?.provider_id || null);
  const [username, setUsername] = useState(passwordData?.username || "");
  const [password, setPassword] = useState(passwordData?.password || "");
  const [note, setNote] = useState(passwordData?.note || "");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    if (mode === "create") {
      console.log("Crear:", { provider, username, password, note });
    } else {
      console.log("Editar:", { provider, username, password, note });
    }
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

  const providerObj = PROVIDERS.find((p) => p.id === provider);
  console.log(PROVIDERS);
  console.log(provider);

  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar
        showBackButton
        onBackPress={() => navigation.goBack()}
        title={mode === "create" ? "Nueva Contraseña" : "Editar Contraseña"}
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
                dropdownIconColor="#000"
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
              secureTextEntry
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
