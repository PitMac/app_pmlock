import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { List, FAB, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomAppBar from "../components/CustomAppBar"; // lo defines en /data/mockPasswords.js
import { MOCK_PASSWORDS } from "../utils/passwords";
import { PROVIDERS } from "../utils/providers";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PasswordsScreen() {
  const navigation = useNavigation();
  const [passwords, setPasswords] = useState([]);
  const theme = useTheme();

  const renderLeftIcon = (provider_id) => {
    const provider = PROVIDERS.find((p) => p.value === provider_id);

    if (provider?.logo) {
      return <Image source={provider.logo} style={styles.logo} />;
    }

    return <List.Icon icon="lock-outline" />;
  };

  const loadPasswords = async () => {
    try {
      const stored = await AsyncStorage.getItem("passwords");
      if (stored) setPasswords(JSON.parse(stored));
    } catch (e) {
      console.log("Error cargando passwords:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadPasswords);
    loadPasswords();
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar
        title="Contraseñas"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={passwords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 4 }}
        renderItem={({ item }) => (
          <List.Item
            title={
              item.provider_id.charAt(0).toUpperCase() +
              item.provider_id.slice(1)
            }
            description={item.username}
            left={() => renderLeftIcon(item.provider_id)}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              navigation.navigate("NewPassword", {
                mode: "edit",
                passwordData: item,
              })
            }
          />
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              alignItems: "center",
              marginTop: 50,
              marginHorizontal: 20,
              padding: 20,
              paddingVertical: 30,
              borderRadius: 12,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              No tienes contraseñas guardadas {"\n"}¡Agrega tu primera
              contraseña!
            </Text>
          </View>
        )}
      />

      <FAB
        icon="plus"
        label="Añadir"
        onPress={() => navigation.navigate("NewPassword", { mode: "create" })}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 5,
  },
});
