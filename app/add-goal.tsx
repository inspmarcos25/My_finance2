import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { useGoals } from '@/hooks/useGoals';
import { useCategories } from '@/hooks/useCategories';
import { useAlert } from '@/template';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';

export default function AddGoalScreen() {
  const router = useRouter();
  const { addGoal } = useGoals();
  const { categories } = useCategories();
  const { showAlert } = useAlert();
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  
  const expenseCategories = categories.filter(c => c.type === 'expense');
  
  const handleSave = () => {
    if (!name.trim()) {
      showAlert('Erro', 'Digite um nome para a meta');
      return;
    }
    
    const numAmount = parseFloat(targetAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showAlert('Erro', 'Digite um valor válido');
      return;
    }
    
    if (!selectedCategoryId) {
      showAlert('Erro', 'Selecione uma categoria');
      return;
    }
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(0);
    
    addGoal({
      name: name.trim(),
      categoryId: selectedCategoryId,
      targetAmount: numAmount,
      deadline: nextMonth.toISOString(),
    });
    
    showAlert('Sucesso', 'Meta adicionada com sucesso!');
    router.back();
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome da Meta</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Reduzir gastos com alimentação"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.textSubtle}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Valor Máximo (Meta)</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="decimal-pad"
          placeholderTextColor={colors.textSubtle}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryGrid}>
          {expenseCategories.map(category => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategoryId === category.id && styles.categoryItemActive,
              ]}
              onPress={() => setSelectedCategoryId(category.id)}
            >
              <CategoryIcon icon={category.icon} color={category.color} size={40} />
              <Text style={styles.categoryLabel} numberOfLines={1}>
                {category.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Criar Meta</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryItemActive: {
    borderColor: colors.primary,
  },
  categoryLabel: {
    ...typography.small,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.textWhite,
  },
});
