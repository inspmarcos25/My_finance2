import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, typography, spacing } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';

const screenWidth = Dimensions.get('window').width;

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyTrendChartProps {
  data: MonthlyData[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  if (data.length === 0) {
    return (
      <View style={[commonStyles.card, styles.container]}>
        <Text style={styles.title}>Tendência Mensal</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sem dados para exibir</Text>
        </View>
      </View>
    );
  }

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        data: data.map(d => d.income),
        color: (opacity = 1) => `rgba(88, 244, 187, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: data.map(d => d.expense),
        color: (opacity = 1) => `rgba(26, 109, 237, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Receitas', 'Despesas'],
  };

  return (
    <View style={[commonStyles.card, styles.container]}>
      <Text style={styles.title}>Tendência Mensal</Text>
      
      <LineChart
        data={chartData}
        width={screenWidth - 64}
        height={220}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(26, 237, 231, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(155, 155, 155, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.primary,
          },
        }}
        bezier
        style={styles.chart}
      />
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Receitas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Despesas</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  empty: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSubtle,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
