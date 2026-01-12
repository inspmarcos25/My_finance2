import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { useCategories } from '@/hooks/useCategories';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { categories } = useCategories();
  
  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias</Text>
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push('/edit-category')}
        >
          <Ionicons name="add" size={24} color={colors.textWhite} />
        </Pressable>
      </View>
      
      <ScrollView 
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Receitas</Text>
          <View style={styles.grid}>
            {incomeCategories.map(category => (
              <Pressable
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push({
                  pathname: '/edit-category',
                  params: { id: category.id },
                })}
              >
                <CategoryIcon 
                  icon={category.icon} 
                  color={category.color} 
                  size={56} 
                />
                <Text style={styles.categoryName} numberOfLines={1}>
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Despesas</Text>
          <View style={styles.grid}>
            {expenseCategories.map(category => (
              <Pressable
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push({
                  pathname: '/edit-category',
                  params: { id: category.id },
                })}
              >
                <CategoryIcon 
                  icon={category.icon} 
                  color={category.color} 
                  size={56} 
                />
                <Text style={styles.categoryName} numberOfLines={1}>
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  categoryName: {
    ...typography.caption,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
