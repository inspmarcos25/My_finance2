import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryIcon } from '../ui/CategoryIcon';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { formatCurrency, formatDate } from '@/services/dataService';
import { Transaction, Category } from '@/types';

interface TransactionItemProps {
  transaction: Transaction;
  category: Category;
  onPress?: () => void;
  onDelete?: () => void;
}

export function TransactionItem({ transaction, category, onPress, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  
  return (
    <Pressable 
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <CategoryIcon icon={category.icon} color={category.color} size={48} />
      
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          {transaction.isRecurring && (
            <Ionicons name="repeat" size={14} color={colors.primary} />
          )}
        </View>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
      
      <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
      </Text>
      
      {onDelete && (
        <Pressable 
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  description: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  amount: {
    ...typography.h4,
    fontWeight: '700',
  },
  income: {
    color: colors.success,
  },
  expense: {
    color: colors.textPrimary,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
});
