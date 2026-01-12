import { Stack } from 'expo-router';
import { AlertProvider, AuthProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { GoalProvider } from '@/contexts/GoalContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useTheme } from '@/hooks/useTheme';

function RootNavigator() {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="add-transaction" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Nova Transação',
          }}
        />
        <Stack.Screen 
          name="add-goal" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Nova Meta',
          }}
        />
        <Stack.Screen 
          name="edit-category" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Editar Categoria',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <CategoryProvider>
              <TransactionProvider>
                <GoalProvider>
                  <RootNavigator />
                </GoalProvider>
              </TransactionProvider>
            </CategoryProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
