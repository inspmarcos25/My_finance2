import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { borderRadius, shadows } from '@/constants/theme';

interface GradientCardProps {
  colors: string[];
  children: ReactNode;
  style?: ViewStyle;
}

export function GradientCard({ colors, children, style }: GradientCardProps) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  gradient: {
    borderRadius: borderRadius.lg,
    padding: 20,
  },
});
