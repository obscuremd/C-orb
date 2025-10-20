import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DimensionValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

interface Props {
  text: string;
  onClick?: () => void;
  width?: DimensionValue;
}

const GradientButton: React.FC<Props> = ({ text, onClick, width }) => {
  return (
    <LinearGradient
      colors={["#0131A1", "#2BD3C6"]} // Border gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.outerGradient, width ? { width } : {}]}
    >
      <TouchableOpacity onPress={onClick} style={{ width: "100%" }}>
        <BlurView intensity={80} tint="dark" style={styles.innerBlur}>
          <Text style={styles.text}>{text}</Text>
        </BlurView>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outerGradient: {
    padding: 1,
    borderRadius: 6,
  },
  innerBlur: {
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Add subtle tint over blur
    overflow: "hidden", // Important for rounded corners with blur
  },
  text: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 16,
  },
});

export default GradientButton;
