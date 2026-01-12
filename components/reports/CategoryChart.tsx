import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';

const screenWidth = Dimensions.get('window').width;

interface CategoryData {
  name: string;
  amount: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.map(item => ({
    ...item,
    legendFontColor: colors.textPrimary,
    legendFontSize: 12,
  }));

  if (data.length === 0) {
    return (
      <View style={[commonStyles.card, styles.container]}>
        <Text style={styles.title}>Distribuição por Categoria</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sem dados para exibir</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[commonStyles.card, styles.container]}>
      <Text style={styles.title}>Distribuição por Categoria</Text>
      
      <PieChart
        data={chartData}
        width={screenWidth - 64}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(26, 237, 231, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
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
  empty: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSubtle,
  },
});
