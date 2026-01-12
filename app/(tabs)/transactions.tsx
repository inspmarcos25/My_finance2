import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Transaction } from '@/types';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useAlert } from '@/template';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';
import { formatMonthYear, isCurrentMonth } from '@/services/dataService';

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { transactions, copyPreviousMonthTransactions, deleteTransaction, updateTransaction } = useTransactions();
  const { categories, getCategoryById } = useCategories();
  const { showAlert } = useAlert();
  
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  
  const currentMonthTransactions = transactions
    .filter(t => isCurrentMonth(t.date))
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleCopyPreviousMonth = () => {
    showAlert(
      'Copiar Despesas',
      'Deseja copiar as transações do mês anterior para este mês?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Copiar',
          onPress: () => {
            copyPreviousMonthTransactions();
            showAlert('Sucesso', 'Transações copiadas com sucesso!');
          },
        },
      ]
    );
  };
  
  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditDescription(transaction.description);
    setEditAmount(transaction.amount.toString());
    setEditCategoryId(transaction.categoryId);
    setEditModalVisible(true);
  };
  
  const handleDeleteTransaction = (id: string) => {
    showAlert(
      'Excluir Transação',
      'Tem certeza que deseja excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(id);
            showAlert('Sucesso', 'Transação excluída!');
          },
        },
      ]
    );
  };
  
  const handleSaveEdit = () => {
    if (!selectedTransaction) return;
    
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('Erro', 'Digite um valor válido');
      return;
    }
    
    if (!editDescription.trim()) {
      showAlert('Erro', 'Digite uma descrição');
      return;
    }
    
    updateTransaction(selectedTransaction.id, {
      description: editDescription,
      amount,
      categoryId: editCategoryId,
    });
    
    setEditModalVisible(false);
    showAlert('Sucesso', 'Transação atualizada!');
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Transações</Text>
        <View style={styles.headerButtons}>
          <Pressable 
            style={styles.iconButton}
            onPress={handleCopyPreviousMonth}
          >
            <Ionicons name="copy-outline" size={24} color={colors.primary} />
          </Pressable>
          <Pressable 
            style={styles.addButton}
            onPress={() => router.push('/add-transaction')}
          >
            <Ionicons name="add" size={24} color={colors.textWhite} />
          </Pressable>
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterButton, filter === 'all' && styles.filterActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todas
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, filter === 'income' && styles.filterActive]}
          onPress={() => setFilter('income')}
        >
          <Text style={[styles.filterText, filter === 'income' && styles.filterTextActive]}>
            Receitas
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, filter === 'expense' && styles.filterActive]}
          onPress={() => setFilter('expense')}
        >
          <Text style={[styles.filterText, filter === 'expense' && styles.filterTextActive]}>
            Despesas
          </Text>
        </Pressable>
      </View>
      
      <ScrollView 
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.monthLabel}>{formatMonthYear(new Date())}</Text>
        
        {currentMonthTransactions.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={colors.textSubtle} />
            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
          </View>
        ) : (
          currentMonthTransactions.map(transaction => {
            const category = getCategoryById(transaction.categoryId);
            if (!category) return null;
            return (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                category={category}
                onPress={() => handleTransactionPress(transaction)}
                onDelete={() => handleDeleteTransaction(transaction.id)}
              />
            );
          })
        )}
      </ScrollView>
      
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setEditModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Transação</Text>
              <Pressable onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>
            
            {selectedTransaction && (
              <View style={styles.modalBody}>
                <Text style={styles.inputLabel}>Descrição</Text>
                <TextInput
                  style={styles.input}
                  value={editDescription}
                  onChangeText={setEditDescription}
                  placeholder="Ex: Supermercado"
                  placeholderTextColor={colors.textSubtle}
                />
                
                <Text style={styles.inputLabel}>Valor</Text>
                <View style={styles.amountInput}>
                  <Text style={styles.currencySymbol}>R$</Text>
                  <TextInput
                    style={styles.input}
                    value={editAmount}
                    onChangeText={setEditAmount}
                    placeholder="0,00"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textSubtle}
                  />
                </View>
                
                <Text style={styles.inputLabel}>Categoria</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryScroll}
                >
                  {categories
                    .filter(c => c.type === selectedTransaction.type)
                    .map(category => (
                      <Pressable
                        key={category.id}
                        style={[
                          styles.categoryChip,
                          editCategoryId === category.id && styles.categoryChipActive,
                          { borderColor: category.color }
                        ]}
                        onPress={() => setEditCategoryId(category.id)}
                      >
                        <Ionicons 
                          name={category.icon as any} 
                          size={20} 
                          color={editCategoryId === category.id ? colors.textWhite : category.color} 
                        />
                        <Text style={[
                          styles.categoryChipText,
                          editCategoryId === category.id && styles.categoryChipTextActive
                        ]}>
                          {category.name}
                        </Text>
                      </Pressable>
                    ))
                  }
                </ScrollView>
                
                <Pressable 
                  style={styles.saveButton}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    ...typography.captionMedium,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.textWhite,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  monthLabel: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textTransform: 'capitalize',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSubtle,
    marginTop: spacing.md,
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
    width: '90%',
    maxWidth: 500,
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
  inputLabel: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  currencySymbol: {
    ...typography.h4,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  categoryScroll: {
    marginVertical: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    ...typography.captionMedium,
    color: colors.textPrimary,
  },
  categoryChipTextActive: {
    color: colors.textWhite,
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
