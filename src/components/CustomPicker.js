import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput, Button, List, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomPicker = (props) => {
  const { items, onValueChange, dropdownIconColor, text } = props;
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(items || []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchText, items]);

  const handleValueChange = (itemValue, itemIndex) => {
    console.log(itemValue, itemIndex);

    onValueChange(itemValue, itemIndex);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[{ borderColor: theme.colors.primary }, styles.pickerButton]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons
          name="chevron-down-sharp"
          size={24}
          color={
            String(text).includes("SELECCIONE") ? "grey" : dropdownIconColor
          }
        />
        {text && (
          <Text
            style={{
              color: String(text).includes("SELECCIONE")
                ? "grey"
                : dropdownIconColor,
              marginHorizontal: 5,
            }}
          >
            {text}
          </Text>
        )}
      </TouchableOpacity>
      <Modal
        transparent={true}
        navigationBarTranslucent={true}
        statusBarTranslucent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.items}>
            <Button onPress={() => setModalVisible(false)}>
              <Ionicons name="close-sharp" size={35} color={"white"} />
            </Button>
          </View>
          <View style={styles.modalContainer}>
            <TextInput
              label={"Buscar..."}
              mode={"outlined"}
              value={searchText}
              onChangeText={setSearchText}
            />
            <View style={{ height: 10 }} />
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.value}
              renderItem={({ item, index }) => (
                <List.Item
                  title={item.label}
                  onPress={() => handleValueChange(item.value, index)}
                />
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  pickerButtonText: {
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContainer: {
    marginTop: 5,
    maxHeight: "60%",
    marginHorizontal: 20,
    marginBottom: 50,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalItemText: {
    fontSize: 18,
    flexShrink: 1,
    marginRight: 10,
  },
  items: { alignItems: "flex-end", paddingRight: 18, paddingTop: 25 },
});

export default CustomPicker;
