import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import Otp from "./ModalElements/Otp";
import { useModal } from "~/providers/ModalProvider";

const CustomModal = () => {
  const { element } = useModal();
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BlurView intensity={70} tint="dark" style={styles.innerBlur}>
        {element}
      </BlurView>
    </View>
  );
};
const styles = StyleSheet.create({
  outerGradient: {
    padding: 1,
    borderRadius: 6,
  },
  innerBlur: {
    borderRadius: 6,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(142, 207, 220, 0.09)", // Add subtle tint over blur
    overflow: "hidden", // Important for rounded corners with blur
  },
  text: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 16,
  },
});
export default CustomModal;
