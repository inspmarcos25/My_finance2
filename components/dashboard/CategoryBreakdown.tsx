import { View, Text, StyleSheet } from 'react-native';
import { CategoryIcon } from '../ui/CategoryIcon';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { formatCurrency } from '@/services/dataService';
import { Category } from '@/types';
import { commonStyles } from '@/constants/styles';

interface CategoryBreakdownProps {
  categories: { category: Category; amount: number; percentage: number }[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  if (categories.length === 0) {
    return (
      <View style={commonStyles.card}>
        <Text style={styles.title}>Despesas por Categoria</Text>
        <Text style={styles.empty}>Nenhuma despesa este mês</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.card}>
      <Text style={styles.title}>Despesas por Categoria</Text>
      
      {categories.map(({ category, amount, percentage }) => (
        <View key={category.id} style={styles.item}>
          <View style={styles.left}>
            <CategoryIcon icon={category.icon} color={category.color} size={40} />
            <View style={styles.info}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>
            </View>
          </View>
          
          <Text style={styles.amount}>{formatCurrency(amount)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  info: {
    marginLeft: spacing.md,
    flex: 1,
  },
  categoryName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  percentage: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  amount: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
