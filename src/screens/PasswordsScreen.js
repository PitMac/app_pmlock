import React from "react";
import { FlatList, View } from "react-native";
import { List, FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomAppBar from "../components/CustomAppBar"; // lo defines en /data/mockPasswords.js
import { MOCK_PASSWORDS } from "../utils/passwords";

export default function PasswordsScreen() {
  const navigation = useNavigation();

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
            left={(props) => <List.Icon {...props} icon="lock-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              navigation.navigate("Password", { passwordData: item })
            }
          />
        )}
      />

      <FAB
        icon="plus"
        label="Añadir"
        onPress={() => navigation.navigate("NewPassword")}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
      />
    </View>
  );
}
