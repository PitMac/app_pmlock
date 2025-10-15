import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import CustomPicker from "../components/CustomPicker";
import CustomAppBar from "../components/CustomAppBar";
import { useNavigation } from "@react-navigation/native";

export default function NewPasswordScreen() {
  const [provider, setProvider] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const navigation = useNavigation();

  const providerList = [
    { label: "Google", value: "google" },
    { label: "Amazon", value: "amazon" },
    { label: "Facebook", value: "facebook" },
    { label: "Twitter", value: "twitter" },
    { label: "GitHub", value: "github" },
  ];

  const handleSave = () => {
    console.log({
      provider,
      username,
      password,
      note,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar
        showBackButton
        onBackPress={() => navigation.goBack()}
        title="Nueva Contraseña"
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Proveedor</Text>
            <CustomPicker
              items={providerList}
              onValueChange={(value) => setProvider(value)}
              dropdownIconColor="#000"
              text={
                provider
                  ? providerList.find((p) => p.value === provider)?.label
                  : "SELECCIONE UN PROVEEDOR"
              }
            />

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
              right={<TextInput.Icon icon="eye" onPress={() => {}} />}
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
              Guardar
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
});
