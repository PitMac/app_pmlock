import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { List, FAB, Text, useTheme, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomAppBar from "../components/CustomAppBar"; // lo defines en /data/mockPasswords.js
import { PROVIDERS } from "../utils/providers";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PasswordsScreen() {
  const navigation = useNavigation();
  const [passwords, setPasswords] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const theme = useTheme();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadPasswords);
    loadPasswords();
    return unsubscribe;
  }, [navigation]);

  const renderLeftIcon = (provider_id) => {
    const provider = PROVIDERS.find((p) => p.value === provider_id);

    if (provider?.logo) {
      return <Image source={provider.logo} style={styles.logo} />;
    }

    return (
      <List.Icon
        style={{
          marginLeft: 10,
        }}
        icon="lock-outline"
      />
    );
  };

  const loadPasswords = async () => {
    try {
      const stored = await AsyncStorage.getItem("passwords");
      if (stored) setPasswords(JSON.parse(stored));
    } catch (e) {
      console.log("Error cargando passwords:", e);
    }
  };

  const filteredPasswords = passwords.filter((item) => {
    const query = searchText.toLowerCase();
    return (
      item.provider_id.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [searchVisible]);

  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar
        title="Contraseñas"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        actions={
          passwords.length > 0
            ? [
                {
                  icon: searchVisible ? "close" : "magnify",
                  onPress: () => setSearchVisible(!searchVisible),
                },
              ]
            : []
        }
      />

      {passwords.length > 0 && searchVisible && (
        <View
          style={[
            { backgroundColor: theme.colors.surface },
            styles.searchContainer,
          ]}
        >
          <TextInput
            mode="outlined"
            ref={searchInputRef}
            placeholder="Buscar por proveedor o usuario"
            value={searchText}
            onChangeText={setSearchText}
            left={<TextInput.Icon icon="magnify" />}
            right={
              <TextInput.Icon icon="close" onPress={() => setSearchText("")} />
            }
            style={styles.searchInput}
          />
        </View>
      )}

      <FlatList
        data={filteredPasswords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 4 }}
        renderItem={({ item }) => (
          <List.Item
            title={
              item.provider_id === "otro" && item.custom_provider_name
                ? item.custom_provider_name
                : item.provider_id.charAt(0).toUpperCase() +
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
          backgroundColor: theme.colors.primary,
        }}
        color={theme.colors.onPrimary}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: "#1E1E1E",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
    marginHorizontal: 20,
    padding: 20,
    paddingVertical: 30,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#aaa",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
