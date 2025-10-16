import { View, Text } from "react-native";
import React from "react";
import CustomAppBar from "../components/CustomAppBar";
import { useNavigation } from "@react-navigation/native";

export default function GeneratePassword() {
  const navigation = useNavigation();
  return (
    <View>
      <CustomAppBar
        title="Generar contraseña"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <Text>GeneratePassword</Text>
    </View>
  );
}
