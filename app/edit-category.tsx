import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '@/hooks/useCategories';
import { useAlert } from '@/template';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';
import { TransactionType } from '@/types';

const ICONS = [
  'briefcase', 'trending-up', 'code', 'restaurant', 'car', 'home',
  'game-controller', 'medical', 'cart', 'airplane', 'book', 'card',
  'fitness', 'gift', 'paw', 'pizza', 'school', 'shirt',
];

const COLORS = [
  '#58F4BB', '#1AEDE7', '#1A6DED', '#1AB0ED', '#1ACBED', '#69C7ED',
  '#FF6B6B', '#FFA726', '#FFD93D', '#6BCF7F', '#A78BFA', '#EC4899',
];

export default function EditCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { categories, addCategory, updateCategory, deleteCategory, getCategoryById } = useCategories();
  const { showAlert } = useAlert();
  
  const isEditing = Boolean(params.id);
  const existingCategory = isEditing ? getCategoryById(params.id as string) : null;
  
  const [type, setType] = useState<TransactionType>(existingCategory?.type || 'expense');
  const [name, setName] = useState(existingCategory?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(existingCategory?.icon || ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(existingCategory?.color || COLORS[0]);
  
  const handleSave = () => {
    if (!name.trim()) {
      showAlert('Erro', 'Digite um nome para a categoria');
      return;
    }
    
    if (isEditing && existingCategory) {
      updateCategory(existingCategory.id, {
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        type,
      });
      showAlert('Sucesso', 'Categoria atualizada com sucesso!');
    } else {
      addCategory({
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        type,
      });
      showAlert('Sucesso', 'Categoria criada com sucesso!');
    }
    
    router.back();
  };
  
  const handleDelete = () => {
    if (!existingCategory) return;
    
    showAlert(
      'Excluir Categoria',
      'Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteCategory(existingCategory.id);
            showAlert('Sucesso', 'Categoria excluída com sucesso!');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.typeSelector}>
        <Pressable
          style={[styles.typeButton, type === 'income' && styles.typeButtonIncome]}
          onPress={() => setType('income')}
        >
          <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
            Receita
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.typeButton, type === 'expense' && styles.typeButtonExpense]}
          onPress={() => setType('expense')}
        >
          <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
            Despesa
          </Text>
        </Pressable>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Alimentação"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.textSubtle}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ícone</Text>
        <View style={styles.iconGrid}>
          {ICONS.map(icon => (
            <Pressable
              key={icon}
              style={[
                styles.iconItem,
                { backgroundColor: `${selectedColor}20` },
                selectedIcon === icon && styles.iconItemActive,
              ]}
              onPress={() => setSelectedIcon(icon)}
            >
              <Ionicons name={icon as any} size={24} color={selectedColor} />
            </Pressable>
          ))}
        </View>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cor</Text>
        <View style={styles.colorGrid}>
          {COLORS.map(color => (
            <Pressable
              key={color}
              style={[
                styles.colorItem,
                { backgroundColor: color },
                selectedColor === color && styles.colorItemActive,
              ]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <Ionicons name="checkmark" size={20} color={colors.textWhite} />
              )}
            </Pressable>
          ))}
        </View>
      </View>
      
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isEditing ? 'Salvar Alterações' : 'Criar Categoria'}
        </Text>
      </Pressable>
      
      {isEditing && (
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Excluir Categoria</Text>
        </Pressable>
      )}
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
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
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
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconItem: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconItemActive: {
    borderColor: colors.primary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorItem: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorItemActive: {
    borderColor: colors.textWhite,
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
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  deleteButtonText: {
    ...typography.button,
    color: colors.danger,
  },
});
