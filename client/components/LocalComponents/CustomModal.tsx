import { View, StyleSheet, Pressable } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { useModal } from "~/providers/ModalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";

const CustomModal = () => {
  const { element, position, modalVisible, setModalVisible } = useModal();

  if (!modalVisible) return null;

  // Choose animation config based on position
  const getAnimation = () => {
    switch (position) {
      case "start": // top
        return {
          from: { opacity: 0, translateY: -100 },
          animate: { opacity: 1, translateY: 0 },
          exit: { opacity: 0, translateY: -100 },
          transition: { type: "spring" as const, damping: 15 },
        };
      case "end": // bottom
        return {
          from: { opacity: 0, translateY: 100 },
          animate: { opacity: 1, translateY: 0 },
          exit: { opacity: 0, translateY: 100 },
          transition: { type: "timing" as const, duration: 300 },
        };
      case "center": // middle
      default:
        return {
          from: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
          transition: { type: "spring" as const, damping: 20 },
        };
    }
  };

  const animation = getAnimation();

  return (
    <View style={styles.overlay}>
      {/* Background pressable (outside area) */}
      <Pressable
        style={styles.background}
        onPress={() => setModalVisible(false)}
      >
        <BlurView intensity={70} tint="dark" style={styles.innerBlur} />
      </Pressable>

      {/* Foreground modal content (not dismissible) */}
      <SafeAreaView
        className={`flex-col justify-${position} flex-1 p-4`}
        pointerEvents="box-none"
      >
        <Pressable style={styles.content} onPress={() => {}}>
          <MotiView {...animation}>{element}</MotiView>
        </Pressable>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  background: {
    ...StyleSheet.absoluteFillObject, // full screen overlay
  },
  innerBlur: {
    flex: 1,
    backgroundColor: "rgba(142, 207, 220, 0.09)",
  },
  content: {
    // modal content styling, e.g. centered card
    alignSelf: "center",
    width: "100%",
  },
});

export default CustomModal;
