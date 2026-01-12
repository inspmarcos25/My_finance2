import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryIcon } from '../ui/CategoryIcon';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { formatCurrency } from '@/services/dataService';
import { Goal, Category } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';

interface GoalCardProps {
  goal: Goal;
  category: Category;
  onPress?: () => void;
}

export function GoalCard({ goal, category, onPress }: GoalCardProps) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = progress >= 100;
  
  return (
    <Pressable 
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <CategoryIcon icon={category.icon} color={category.color} size={40} />
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>{goal.name}</Text>
          <Text style={styles.category}>{category.name}</Text>
        </View>
        {isCompleted && (
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={[category.color, colors.success]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
      </View>
      
      <View style={styles.footer}>
        <View>
          <Text style={styles.label}>Atual</Text>
          <Text style={styles.value}>{formatCurrency(goal.currentAmount)}</Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.label}>Meta</Text>
          <Text style={styles.value}>{formatCurrency(goal.targetAmount)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  category: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressText: {
    ...typography.captionMedium,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    minWidth: 40,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  label: {
    ...typography.small,
    color: colors.textSecondary,
  },
  value: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
