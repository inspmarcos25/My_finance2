import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { GoalCard } from '@/components/goals/GoalCard';
import { useGoals } from '@/hooks/useGoals';
import { useCategories } from '@/hooks/useCategories';
import { useAlert } from '@/template';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';
import { formatCurrency } from '@/services/dataService';
import { Goal } from '@/types';

export default function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { goals, addAmountToGoal } = useGoals();
  const { getCategoryById } = useCategories();
  const { showAlert } = useAlert();
  
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputAmount, setInputAmount] = useState('');

  const handleGoalPress = (goal: Goal) => {
    setSelectedGoal(goal);
    setInputAmount('');
    setModalVisible(true);
  };

  const handleAddAmount = () => {
    if (!selectedGoal) return;
    
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('Erro', 'Digite um valor válido');
      return;
    }

    addAmountToGoal(selectedGoal.id, amount);
    setModalVisible(false);
    showAlert('Sucesso', `${formatCurrency(amount)} adicionado à meta!`);
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Metas Financeiras</Text>
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push('/add-goal')}
        >
          <Ionicons name="add" size={24} color={colors.textWhite} />
        </Pressable>
      </View>
      
      <ScrollView 
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {goals.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="flag-outline" size={48} color={colors.textSubtle} />
            <Text style={styles.emptyText}>Nenhuma meta cadastrada</Text>
            <Text style={styles.emptySubtext}>
              Crie metas para controlar seus gastos por categoria
            </Text>
          </View>
        ) : (
          goals.map(goal => {
            const category = getCategoryById(goal.categoryId);
            if (!category) return null;
            return (
              <GoalCard
                key={goal.id}
                goal={goal}
                category={category}
                onPress={() => handleGoalPress(goal)}
              />
            );
          })
        )}
      </ScrollView>
      
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Valor à Meta</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>
            
            {selectedGoal && (
              <View style={styles.modalBody}>
                <Text style={styles.goalName}>{selectedGoal.name}</Text>
                <Text style={styles.goalProgress}>
                  {formatCurrency(selectedGoal.currentAmount)} / {formatCurrency(selectedGoal.targetAmount)}
                </Text>
                
                <Text style={styles.inputLabel}>Valor a adicionar</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.currencySymbol}>R$</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0,00"
                    keyboardType="numeric"
                    value={inputAmount}
                    onChangeText={setInputAmount}
                    placeholderTextColor={colors.textSubtle}
                  />
                </View>
                
                <Pressable 
                  style={styles.confirmButton}
                  onPress={handleAddAmount}
                >
                  <Text style={styles.confirmButtonText}>Adicionar</Text>
                </Pressable>
              </View>
            )}
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
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    ...typography.h4,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSubtle,
    marginTop: spacing.sm,
    textAlign: 'center',
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
  modalBody: {
    padding: spacing.md,
  },
  goalName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  goalProgress: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  currencySymbol: {
    ...typography.h3,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.h3,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    ...typography.button,
    color: colors.textWhite,
  },
});
