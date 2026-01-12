import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, borderRadius } from '@/constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  
  const handleThemeChange = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('auto');
    } else {
      setThemeMode('light');
    }
  };
  
  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Escuro';
      case 'auto':
        return 'Automático';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Configurações</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Aparência</Text>
          
          <Pressable 
            style={[styles.settingItem, { borderBottomColor: colors.borderLight }]}
            onPress={handleThemeChange}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.surfaceLight }]}>
                <Ionicons 
                  name={isDark ? 'moon' : 'sunny'} 
                  size={20} 
                  color={colors.primary} 
                />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  Tema
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Personalizar aparência do app
                </Text>
              </View>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: colors.primary }]}>
                {getThemeLabel()}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSubtle} />
            </View>
          </Pressable>
          
          <View style={[styles.themeOptions, { borderTopColor: colors.borderLight }]}>
            <Pressable
              style={[
                styles.themeOption,
                themeMode === 'light' && [styles.themeOptionActive, { backgroundColor: colors.primary }]
              ]}
              onPress={() => setThemeMode('light')}
            >
              <Ionicons 
                name="sunny" 
                size={20} 
                color={themeMode === 'light' ? colors.textWhite : colors.textSecondary} 
              />
              <Text style={[
                styles.themeOptionText,
                { color: themeMode === 'light' ? colors.textWhite : colors.textSecondary }
              ]}>
                Claro
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.themeOption,
                themeMode === 'dark' && [styles.themeOptionActive, { backgroundColor: colors.primary }]
              ]}
              onPress={() => setThemeMode('dark')}
            >
              <Ionicons 
                name="moon" 
                size={20} 
                color={themeMode === 'dark' ? colors.textWhite : colors.textSecondary} 
              />
              <Text style={[
                styles.themeOptionText,
                { color: themeMode === 'dark' ? colors.textWhite : colors.textSecondary }
              ]}>
                Escuro
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.themeOption,
                themeMode === 'auto' && [styles.themeOptionActive, { backgroundColor: colors.primary }]
              ]}
              onPress={() => setThemeMode('auto')}
            >
              <Ionicons 
                name="phone-portrait" 
                size={20} 
                color={themeMode === 'auto' ? colors.textWhite : colors.textSecondary} 
              />
              <Text style={[
                styles.themeOptionText,
                { color: themeMode === 'auto' ? colors.textWhite : colors.textSecondary }
              ]}>
                Auto
              </Text>
            </Pressable>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Sobre</Text>
          
          <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.surfaceLight }]}>
                <Ionicons name="information-circle" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  Versão
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  1.0.0
                </Text>
              </View>
            </View>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.h2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  section: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...typography.small,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    ...typography.bodyMedium,
  },
  settingDescription: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  settingValue: {
    ...typography.bodyMedium,
  },
  themeOptions: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  themeOptionActive: {
    
  },
  themeOptionText: {
    ...typography.captionMedium,
  },
});
