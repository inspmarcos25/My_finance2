import { View, Text, StyleSheet } from 'react-native';
import { GradientCard } from '../ui/GradientCard';
import { colors, typography, spacing } from '@/constants/theme';
import { formatCurrency } from '@/services/dataService';

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
}

export function BalanceCard({ balance, income, expense }: BalanceCardProps) {
  return (
    <GradientCard colors={colors.gradientBlue}>
      <Text style={styles.label}>Saldo Atual</Text>
      <Text style={styles.balance}>{formatCurrency(balance)}</Text>
      
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Receitas</Text>
          <Text style={styles.statValue}>{formatCurrency(income)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Despesas</Text>
          <Text style={styles.statValue}>{formatCurrency(expense)}</Text>
        </View>
      </View>
    </GradientCard>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    color: colors.textWhite,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  balance: {
    ...typography.h1,
    color: colors.textWhite,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    ...typography.small,
    color: colors.textWhite,
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h4,
    color: colors.textWhite,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.textWhite,
    opacity: 0.2,
    marginHorizontal: spacing.md,
  },
});
