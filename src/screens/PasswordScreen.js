import React, { useState } from "react";
import { View } from "react-native";
import {
  TextInput,
  IconButton,
  Text,
  HelperText,
  Divider,
} from "react-native-paper";
import * as LocalAuthentication from "expo-local-authentication";
import CustomAppBar from "../components/CustomAppBar";
import { useNavigation } from "@react-navigation/native";

export default function PasswordScreen({ route }) {
  const { passwordData } = route.params;
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

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

  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar
        showBackButton
        onBackPress={() => navigation.goBack()}
        title={passwordData.provider_id.toUpperCase()}
      />
      <View style={{ padding: 10 }}>
        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          Información de acceso
        </Text>

        <TextInput
          label="Usuario"
          value={passwordData.username}
          mode="outlined"
          editable={false}
          left={<TextInput.Icon icon="account" />}
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Contraseña"
          value={passwordData.password}
          secureTextEntry={!showPassword}
          mode="outlined"
          editable={false}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={handleShowPassword}
            />
          }
          left={<TextInput.Icon icon="lock" />}
          style={{ marginBottom: 12 }}
        />

        <HelperText type="info" visible={true}>
          Toca el ícono del ojo y autentica para ver la contraseña
        </HelperText>

        <Divider style={{ marginVertical: 16 }} />

        <TextInput
          label="Nota"
          value={passwordData.note || ""}
          mode="outlined"
          editable={false}
          multiline
          left={<TextInput.Icon icon="note-text-outline" />}
        />
      </View>
    </View>
  );
}
