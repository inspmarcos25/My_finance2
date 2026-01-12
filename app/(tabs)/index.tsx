import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { GoalPreview } from '@/components/dashboard/GoalPreview';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useGoals } from '@/hooks/useGoals';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, borderRadius } from '@/constants/theme';
import { formatMonthYear } from '@/services/dataService';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { transactions, getMonthlyStats, processRecurringTransactions } = useTransactions();
  const { categories, getCategoryById } = useCategories();
  const { goals, updateGoalProgress } = useGoals();
  
  const [currentMonth] = useState(new Date());
  const stats = getMonthlyStats(currentMonth);
  
  // Processar despesas recorrentes ao montar
  useEffect(() => {
    processRecurringTransactions();
  }, []);
  
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const categoryData = stats.categoryBreakdown
    .map(({ categoryId, amount }) => {
      const category = getCategoryById(categoryId);
      if (!category) return null;
      return {
        category,
        amount,
        percentage: (amount / stats.totalExpense) * 100,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b?.amount || 0) - (a?.amount || 0))
    .slice(0, 5) as any[];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>Olá! 👋</Text>
            <Text style={[styles.month, { color: colors.textSecondary }]}>{formatMonthYear(currentMonth)}</Text>
          </View>
          
          <Pressable 
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/add-transaction')}
          >
            <Ionicons name="add" size={24} color={colors.textWhite} />
          </Pressable>
        </View>
        
        <View style={styles.content}>
          <BalanceCard 
            balance={stats.balance}
            income={stats.totalIncome}
            expense={stats.totalExpense}
          />
          
          {goals.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Metas Financeiras</Text>
                <Pressable onPress={() => router.push('/goals')}>
                  <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todas</Text>
                </Pressable>
              </View>
              
              {goals.slice(0, 2).map(goal => {
                const category = getCategoryById(goal.categoryId);
                if (!category) return null;
                return (
                  <GoalPreview
                    key={goal.id}
                    goal={goal}
                    category={category}
                    onPress={() => router.push('/goals')}
                  />
                );
              })}
            </View>
          )}
          
          <CategoryBreakdown categories={categoryData} />
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Transações Recentes</Text>
              <Pressable onPress={() => router.push('/transactions')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todas</Text>
              </Pressable>
            </View>
            
            {recentTransactions.map(transaction => {
              const category = getCategoryById(transaction.categoryId);
              if (!category) return null;
              return (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  category={category}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  greeting: {
    ...typography.h3,
  },
  month: {
    ...typography.caption,
    marginTop: spacing.xs,
    textTransform: 'capitalize',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
  },
  seeAll: {
    ...typography.captionMedium,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
});
