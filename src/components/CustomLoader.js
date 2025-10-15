import { View, Text, StyleSheet } from "react-native";
import { Modal, Portal, useTheme } from "react-native-paper";
import { PacmanIndicator } from "react-native-indicators";

export default function CustomLoader({ loading, modalStyle, indicatorStyle }) {
  const theme = useTheme();
  return (
    <Portal>
      <Modal visible={loading}>
        <View style={[styles.modalBackground, modalStyle]}>
          <View style={[styles.activityIndicatorWrapper, indicatorStyle]}>
            <PacmanIndicator color={theme.colors.primary} size={70} />
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "red",
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    height: 120,
    width: 120,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
