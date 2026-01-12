import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { InsightCard } from '@/components/reports/InsightCard';
import { CategoryChart } from '@/components/reports/CategoryChart';
import { MonthlyTrendChart } from '@/components/reports/MonthlyTrendChart';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useGoals } from '@/hooks/useGoals';
import { colors, typography, spacing } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';
import { formatCurrency, getMonthName, formatMonthYear } from '@/services/dataService';
import { borderRadius } from '@/constants/theme';

type FilterPeriod = 'current' | '3months' | '6months' | 'custom';

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const { transactions, getMonthlyStats } = useTransactions();
  const { categories, getCategoryById } = useCategories();
  const { goals } = useGoals();
  
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('current');
  const [customMonth, setCustomMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  const currentMonth = filterPeriod === 'custom' ? customMonth : new Date();
  const stats = getMonthlyStats(currentMonth);
  
  // Calcular insights
  const insights = useMemo(() => {
    // Maior categoria de despesa
    const topExpenseCategory = stats.categoryBreakdown
      .filter(({ categoryId }) => getCategoryById(categoryId)?.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0];
    
    const topCategory = topExpenseCategory 
      ? getCategoryById(topExpenseCategory.categoryId)
      : null;
    
    // Média diária de gastos
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const dailyAverage = stats.totalExpense / daysInMonth;
    
    // Economia (receitas - despesas)
    const savings = stats.totalIncome - stats.totalExpense;
    const savingsPercentage = stats.totalIncome > 0 
      ? ((savings / stats.totalIncome) * 100).toFixed(1)
      : '0';
    
    // Progresso das metas
    const goalsOnTrack = goals.filter(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      return progress <= 100;
    }).length;
    
    return {
      topCategory,
      topCategoryAmount: topExpenseCategory?.amount || 0,
      dailyAverage,
      savings,
      savingsPercentage,
      goalsOnTrack,
      totalGoals: goals.length,
    };
  }, [stats, goals, categories]);
  
  // Dados para gráfico de pizza
  const pieChartData = useMemo(() => {
    return stats.categoryBreakdown
      .filter(({ categoryId }) => getCategoryById(categoryId)?.type === 'expense')
      .slice(0, 5)
      .map(({ categoryId, amount }) => {
        const category = getCategoryById(categoryId);
        return {
          name: category?.name || 'Outros',
          amount,
          color: category?.color || colors.primary,
        };
      });
  }, [stats.categoryBreakdown]);
  
  // Dados para gráfico de tendência
  const trendChartData = useMemo(() => {
    const monthsCount = filterPeriod === '6months' ? 6 : filterPeriod === '3months' ? 3 : 6;
    const monthsData = [];
    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStats = getMonthlyStats(date);
      monthsData.push({
        month: getMonthName(date).substring(0, 3),
        income: monthStats.totalIncome,
        expense: monthStats.totalExpense,
      });
    }
    return monthsData;
  }, [transactions, filterPeriod]);
  
  // Gerar lista de meses disponíveis (últimos 12 meses)
  const availableMonths = useMemo(() => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date);
    }
    return months;
  }, []);
  
  const handleFilterChange = (period: FilterPeriod) => {
    setFilterPeriod(period);
    if (period !== 'custom') {
      setCustomMonth(new Date());
    }
  };
  
  const handleMonthSelect = (month: Date) => {
    setCustomMonth(month);
    setFilterPeriod('custom');
    setShowMonthPicker(false);
  };
  
  const getFilterLabel = () => {
    switch (filterPeriod) {
      case 'current':
        return 'Mês Atual';
      case '3months':
        return 'Últimos 3 Meses';
      case '6months':
        return 'Últimos 6 Meses';
      case 'custom':
        return formatMonthYear(customMonth);
      default:
        return 'Mês Atual';
    }
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Relatórios</Text>
          <Text style={styles.subtitle}>Análise financeira detalhada</Text>
        </View>
        
        <Pressable 
          style={styles.filterButton}
          onPress={() => setShowMonthPicker(true)}
        >
          <Text style={styles.filterButtonText}>{getFilterLabel()}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.textWhite} />
        </Pressable>
      </View>
      
      <View style={styles.quickFilters}>
        <Pressable
          style={[styles.quickFilterChip, filterPeriod === 'current' && styles.quickFilterActive]}
          onPress={() => handleFilterChange('current')}
        >
          <Text style={[styles.quickFilterText, filterPeriod === 'current' && styles.quickFilterTextActive]}>
            Atual
          </Text>
        </Pressable>
        <Pressable
          style={[styles.quickFilterChip, filterPeriod === '3months' && styles.quickFilterActive]}
          onPress={() => handleFilterChange('3months')}
        >
          <Text style={[styles.quickFilterText, filterPeriod === '3months' && styles.quickFilterTextActive]}>
            3 Meses
          </Text>
        </Pressable>
        <Pressable
          style={[styles.quickFilterChip, filterPeriod === '6months' && styles.quickFilterActive]}
          onPress={() => handleFilterChange('6months')}
        >
          <Text style={[styles.quickFilterText, filterPeriod === '6months' && styles.quickFilterTextActive]}>
            6 Meses
          </Text>
        </Pressable>
        <Pressable
          style={[styles.quickFilterChip, filterPeriod === 'custom' && styles.quickFilterActive]}
          onPress={() => setShowMonthPicker(true)}
        >
          <Ionicons 
            name="calendar-outline" 
            size={16} 
            color={filterPeriod === 'custom' ? colors.textWhite : colors.textSecondary} 
          />
          <Text style={[styles.quickFilterText, filterPeriod === 'custom' && styles.quickFilterTextActive]}>
            Personalizado
          </Text>
        </Pressable>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Insights do Mês</Text>
        
        <InsightCard
          icon="trending-down"
          title="Maior Despesa"
          value={insights.topCategory?.name || 'N/A'}
          subtitle={formatCurrency(insights.topCategoryAmount)}
          color={insights.topCategory?.color || colors.primary}
        />
        
        <InsightCard
          icon="calendar"
          title="Média Diária de Gastos"
          value={formatCurrency(insights.dailyAverage)}
          subtitle={`Baseado em ${new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()} dias`}
          color={colors.blue}
        />
        
        <InsightCard
          icon={insights.savings >= 0 ? 'trending-up' : 'trending-down'}
          title="Economia do Mês"
          value={formatCurrency(Math.abs(insights.savings))}
          subtitle={`${insights.savingsPercentage}% da receita total`}
          color={insights.savings >= 0 ? colors.success : colors.danger}
        />
        
        {insights.totalGoals > 0 && (
          <InsightCard
            icon="flag"
            title="Metas no Caminho Certo"
            value={`${insights.goalsOnTrack}/${insights.totalGoals}`}
            subtitle={`${((insights.goalsOnTrack / insights.totalGoals) * 100).toFixed(0)}% das suas metas`}
            color={colors.cyan}
          />
        )}
        
        <Text style={styles.sectionTitle}>Gráficos</Text>
        
        <CategoryChart data={pieChartData} />
        
        <MonthlyTrendChart data={trendChartData} />
        
        <View style={[commonStyles.card, styles.summaryCard]}>
          <Text style={styles.summaryTitle}>Resumo Geral</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total de Transações</Text>
            <Text style={styles.summaryValue}>{transactions.length}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Categorias Ativas</Text>
            <Text style={styles.summaryValue}>{categories.length}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Metas Cadastradas</Text>
            <Text style={styles.summaryValue}>{goals.length}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <Text style={styles.summaryLabel}>Taxa de Economia</Text>
            <Text style={[
              styles.summaryValue,
              { color: insights.savings >= 0 ? colors.success : colors.danger }
            ]}>
              {insights.savingsPercentage}%
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowMonthPicker(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Mês</Text>
              <Pressable onPress={() => setShowMonthPicker(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.monthList}>
              {availableMonths.map((month, index) => {
                const isSelected = filterPeriod === 'custom' && 
                  month.getMonth() === customMonth.getMonth() && 
                  month.getFullYear() === customMonth.getFullYear();
                
                return (
                  <Pressable
                    key={index}
                    style={[styles.monthItem, isSelected && styles.monthItemActive]}
                    onPress={() => handleMonthSelect(month)}
                  >
                    <Text style={[styles.monthItemText, isSelected && styles.monthItemTextActive]}>
                      {formatMonthYear(month)}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={colors.textWhite} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  filterButtonText: {
    ...typography.captionMedium,
    color: colors.textWhite,
  },
  quickFilters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    gap: spacing.xs,
  },
  quickFilterActive: {
    backgroundColor: colors.primary,
  },
  quickFilterText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  quickFilterTextActive: {
    color: colors.textWhite,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    width: '85%',
    maxWidth: 400,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  monthList: {
    padding: spacing.sm,
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  monthItemActive: {
    backgroundColor: colors.primary,
  },
  monthItemText: {
    ...typography.body,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  monthItemTextActive: {
    ...typography.bodyMedium,
    color: colors.textWhite,
  },
});
