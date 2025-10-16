import { View, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import CustomAppBar from "../components/CustomAppBar";
import { useNavigation } from "@react-navigation/native";
import {
  Card,
  useTheme,
  Text,
  TextInput,
  Switch,
  Button,
} from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { showAlert } from "../components/CustomAlert";

export default function GeneratePassword() {
  const navigation = useNavigation();
  const theme = useTheme();

  const [length, setLength] = useState("12");
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const generatePassword = () => {
    const len = Math.max(4, Math.min(parseInt(length) || 12, 64)); // asegura rango 4–64

    let chars = "";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()-_=+[]{};:,.<>?/";

    if (chars.length === 0) {
      setGeneratedPassword("");
      return;
    }

    let password = "";
    for (let i = 0; i < len; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars.charAt(randomIndex);
    }

    setGeneratedPassword(password);
  };

  const copyToClipboard = async () => {
    if (!generatedPassword) return;
    await Clipboard.setStringAsync(generatedPassword);
    showAlert({
      title: "Contraseña copiada",
      message: "Contraseña generada correctamente.",
    });
  };

  return (
    <View style={styles.container}>
      <CustomAppBar
        title="Generar contraseña"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Card style={[{ backgroundColor: theme.colors.surface }, styles.card]}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <TextInput
            label="Longitud"
            mode="outlined"
            keyboardType="numeric"
            value={length}
            onChangeText={setLength}
            style={styles.input}
          />
          <View style={styles.optionRow}>
            <Text>Incluir mayúsculas</Text>
            <Switch
              value={includeUppercase}
              onValueChange={setIncludeUppercase}
            />
          </View>
          <View style={styles.optionRow}>
            <Text>Incluir minúsculas</Text>
            <Switch
              value={includeLowercase}
              onValueChange={setIncludeLowercase}
            />
          </View>
          <View style={styles.optionRow}>
            <Text>Incluir números</Text>
            <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
          </View>
          <View style={styles.optionRow}>
            <Text>Incluir símbolos</Text>
            <Switch value={includeSymbols} onValueChange={setIncludeSymbols} />
          </View>
          <Button
            mode="contained"
            style={styles.generateButton}
            onPress={generatePassword}
          >
            Generar contraseña
          </Button>
          {generatedPassword ? (
            <View style={styles.resultContainer}>
              <Text selectable style={styles.passwordText}>
                {generatedPassword}
              </Text>

              <Button
                mode="outlined"
                icon="content-copy"
                onPress={copyToClipboard}
                style={styles.copyButton}
              >
                Copiar
              </Button>
            </View>
          ) : (
            <Text style={styles.placeholder}>Genera una contraseña segura</Text>
          )}
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
    padding: 16,
  },
  input: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  generateButton: {
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  passwordText: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
  },
  copyButton: {
    width: 150,
  },
  placeholder: {
    marginTop: 20,
    textAlign: "center",
    color: "#888",
  },
});
