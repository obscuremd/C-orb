import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DimensionValue,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  text: string;
  onClick?: () => void;
  width?: DimensionValue;
  size?: ButtonSize;
}

const sizeStyles: Record<ButtonSize, { outer: ViewStyle; inner: ViewStyle; text: TextStyle }> = {
  sm: {
    outer: { borderRadius: 4, padding: 1 },
    inner: { paddingVertical: 6, paddingHorizontal: 16 },
    text: { fontSize: 14 },
  },
  md: {
    outer: { borderRadius: 6, padding: 1 },
    inner: { paddingVertical: 12, paddingHorizontal: 24 },
    text: { fontSize: 16 },
  },
  lg: {
    outer: { borderRadius: 8, padding: 1 },
    inner: { paddingVertical: 16, paddingHorizontal: 32 },
    text: { fontSize: 18 },
  },
};

const GradientButton: React.FC<Props> = ({ text, onClick, width, size = 'md' }) => {
  const { outer, inner, text: textStyle } = sizeStyles[size];
  const styles = getStyles(size);

  return (
    <LinearGradient
      colors={['#0131A1', '#2BD3C6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[outer, width ? { width } : {}, { alignSelf: 'flex-start' }]}>
      <TouchableOpacity onPress={onClick} style={{ width: '100%' }}>
        <BlurView intensity={80} tint="dark" style={[styles.innerBlur, inner]}>
          <Text style={[textStyle, styles.text]}>{text}</Text>
        </BlurView>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const getStyles = (size: ButtonSize) =>
  StyleSheet.create({
    innerBlur: {
      borderRadius: size === 'sm' ? 4 : size === 'md' ? 6 : 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      overflow: 'hidden', // essential for clipping blur
      paddingVertical: size === 'sm' ? 6 : size === 'md' ? 12 : 16,
      paddingHorizontal: size === 'sm' ? 16 : size === 'md' ? 24 : 32,
    },
    text: {
      color: '#fff',
      fontWeight: '400',
      fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18,
    },
  });

export default GradientButton;
