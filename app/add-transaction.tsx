import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useAlert } from '@/template';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';
import { TransactionType } from '@/types';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const { categories } = useCategories();
  const { showAlert } = useAlert();
  
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  
  const filteredCategories = categories.filter(c => c.type === type);
  
  const handleSave = () => {
    if (!description.trim()) {
      showAlert('Erro', 'Digite uma descrição para a transação');
      return;
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showAlert('Erro', 'Digite um valor válido');
      return;
    }
    
    if (!selectedCategoryId) {
      showAlert('Erro', 'Selecione uma categoria');
      return;
    }
    
    addTransaction({
      description: description.trim(),
      amount: numAmount,
      type,
      categoryId: selectedCategoryId,
      date: new Date().toISOString(),
      isRecurring,
      recurringDay: isRecurring ? new Date().getDate() : undefined,
    });
    
    showAlert('Sucesso', 'Transação adicionada com sucesso!');
    router.back();
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.typeSelector}>
        <Pressable
          style={[styles.typeButton, type === 'income' && styles.typeButtonIncome]}
          onPress={() => {
            setType('income');
            setSelectedCategoryId('');
          }}
        >
          <Ionicons 
            name="arrow-down" 
            size={20} 
            color={type === 'income' ? colors.textWhite : colors.success} 
          />
          <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
            Receita
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.typeButton, type === 'expense' && styles.typeButtonExpense]}
          onPress={() => {
            setType('expense');
            setSelectedCategoryId('');
          }}
        >
          <Ionicons 
            name="arrow-up" 
            size={20} 
            color={type === 'expense' ? colors.textWhite : colors.primary} 
          />
          <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
            Despesa
          </Text>
        </Pressable>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Supermercado"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={colors.textSubtle}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholderTextColor={colors.textSubtle}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryGrid}>
          {filteredCategories.map(category => (
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
      
      <Pressable
        style={styles.recurringToggle}
        onPress={() => setIsRecurring(!isRecurring)}
      >
        <View style={styles.recurringLeft}>
          <Ionicons name="repeat" size={20} color={colors.primary} />
          <Text style={styles.recurringText}>Despesa recorrente mensal</Text>
        </View>
        <View style={[styles.checkbox, isRecurring && styles.checkboxActive]}>
          {isRecurring && <Ionicons name="checkmark" size={16} color={colors.textWhite} />}
        </View>
      </Pressable>
      
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar Transação</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
  },
  typeButtonIncome: {
    backgroundColor: colors.success,
  },
  typeButtonExpense: {
    backgroundColor: colors.primary,
  },
  typeText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  typeTextActive: {
    color: colors.textWhite,
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
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  recurringLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  recurringText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    ...typography.button,
    color: colors.textWhite,
  },
});
