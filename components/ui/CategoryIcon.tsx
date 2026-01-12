import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { borderRadius } from '@/constants/theme';

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: number;
}

export function CategoryIcon({ icon, color, size = 40 }: CategoryIconProps) {
  return (
    <View style={[styles.container, { backgroundColor: `${color}20`, width: size, height: size }]}>
      <Ionicons name={icon as any} size={size * 0.5} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
