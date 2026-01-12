import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Goal, Category } from '@/types';
import { typography, spacing, borderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/services/dataService';

interface GoalPreviewProps {
  goal: Goal;
  category: Category;
  onPress?: () => void;
}

export function GoalPreview({ goal, category, onPress }: GoalPreviewProps) {
  const { colors } = useTheme();
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  const isCompleted = progress >= 100;
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.surface },
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={isCompleted ? [colors.success, colors.cyan] : [category.color, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
            <Ionicons name={category.icon as any} size={24} color={colors.textWhite} />
          </View>
          {isCompleted && (
            <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.3)' }]}>
              <Ionicons name="checkmark" size={14} color={colors.textWhite} />
              <Text style={[styles.badgeText, { color: colors.textWhite }]}>Concluída</Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.name, { color: colors.textWhite }]} numberOfLines={1}>
          {goal.name}
        </Text>
        
        <View style={styles.progressSection}>
          <View style={styles.amountRow}>
            <Text style={[styles.currentAmount, { color: colors.textWhite }]}>
              {formatCurrency(goal.currentAmount)}
            </Text>
            <Text style={[styles.targetAmount, { color: 'rgba(255, 255, 255, 0.8)' }]}>
              / {formatCurrency(goal.targetAmount)}
            </Text>
          </View>
          
          <View style={[styles.progressBar, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: colors.textWhite,
                }
              ]} 
            />
          </View>
          
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <Text style={[styles.footerLabel, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                Progresso
              </Text>
              <Text style={[styles.footerValue, { color: colors.textWhite }]}>
                {progress.toFixed(0)}%
              </Text>
            </View>
            {!isCompleted && (
              <View style={[styles.footerItem, styles.footerItemRight]}>
                <Text style={[styles.footerLabel, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                  Faltam
                </Text>
                <Text style={[styles.footerValue, { color: colors.textWhite }]}>
                  {formatCurrency(remaining)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  gradient: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  badgeText: {
    ...typography.small,
    fontWeight: '600',
  },
  name: {
    ...typography.h4,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  progressSection: {
    gap: spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  currentAmount: {
    ...typography.h3,
    fontWeight: '700',
  },
  targetAmount: {
    ...typography.body,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  footerItem: {
    gap: spacing.xs,
  },
  footerItemRight: {
    alignItems: 'flex-end',
  },
  footerLabel: {
    ...typography.small,
    fontWeight: '500',
  },
  footerValue: {
    ...typography.captionMedium,
    fontWeight: '600',
  },
});
