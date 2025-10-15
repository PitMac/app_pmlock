import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { List, FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomAppBar from "../components/CustomAppBar"; // lo defines en /data/mockPasswords.js
import { MOCK_PASSWORDS } from "../utils/passwords";
import { PROVIDERS } from "../utils/providers";
import { Image } from "expo-image";

export default function PasswordsScreen() {
  const navigation = useNavigation();

  const renderLeftIcon = (provider_id) => {
    const provider = PROVIDERS.find((p) => p.value === provider_id);

    if (provider?.logo) {
      return <Image source={provider.logo} style={styles.logo} />;
    }

    return <List.Icon icon="lock-outline" />;
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar title="Contraseñas" />

      <FlatList
        data={MOCK_PASSWORDS}
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
