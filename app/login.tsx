import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth, useAlert } from '@/template';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, borderRadius } from '@/constants/theme';

type AuthMode = 'login' | 'register';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { sendOTP, verifyOTPAndLogin, signInWithPassword, operationLoading } = useAuth();
  const { showAlert } = useAlert();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const handleSendOTP = async () => {
    if (!email.trim()) {
      showAlert('Erro', 'Digite seu e-mail');
      return;
    }
    
    if (!email.includes('@')) {
      showAlert('Erro', 'Digite um e-mail válido');
      return;
    }
    
    const { error } = await sendOTP(email.trim());
    if (error) {
      showAlert('Erro', error);
      return;
    }
    
    setOtpSent(true);
    showAlert('Sucesso', 'Código de verificação enviado para seu e-mail');
  };
  
  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !otp.trim()) {
      showAlert('Erro', 'Preencha todos os campos');
      return;
    }
    
    if (password.length < 6) {
      showAlert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    if (password !== confirmPassword) {
      showAlert('Erro', 'As senhas não coincidem');
      return;
    }
    
    if (otp.length !== 4) {
      showAlert('Erro', 'O código deve ter 4 dígitos');
      return;
    }
    
    const { error } = await verifyOTPAndLogin(email.trim(), otp.trim(), { password: password.trim() });
    if (error) {
      showAlert('Erro', error);
      return;
    }
    
    // AuthRouter irá redirecionar automaticamente
  };
  
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Erro', 'Preencha e-mail e senha');
      return;
    }
    
    const { error } = await signInWithPassword(email.trim(), password.trim());
    if (error) {
      showAlert('Erro', error);
      return;
    }
    
    // AuthRouter irá redirecionar automaticamente
  };
  
  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setOtpSent(false);
    setOtp('');
    setPassword('');
    setConfirmPassword('');
  };
  
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={colors.gradientBlue}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Ionicons name="wallet" size={48} color={colors.textWhite} />
            </View>
            <Text style={[styles.title, { color: colors.textWhite }]}>FinanceFlow</Text>
            <Text style={[styles.subtitle, { color: 'rgba(255, 255, 255, 0.9)' }]}>
              Controle financeiro inteligente
            </Text>
          </View>
          
          <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modeSelector}>
              <Pressable 
                style={[
                  styles.modeButton,
                  mode === 'login' && [styles.modeButtonActive, { backgroundColor: colors.primary }]
                ]}
                onPress={() => setMode('login')}
              >
                <Text style={[
                  styles.modeButtonText,
                  { color: mode === 'login' ? colors.textWhite : colors.textSecondary }
                ]}>
                  Entrar
                </Text>
              </Pressable>
              <Pressable 
                style={[
                  styles.modeButton,
                  mode === 'register' && [styles.modeButtonActive, { backgroundColor: colors.primary }]
                ]}
                onPress={() => setMode('register')}
              >
                <Text style={[
                  styles.modeButtonText,
                  { color: mode === 'register' ? colors.textWhite : colors.textSecondary }
                ]}>
                  Cadastrar
                </Text>
              </Pressable>
            </View>
            
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>E-mail</Text>
                <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
                  <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder="seu@email.com"
                    placeholderTextColor={colors.textSubtle}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!operationLoading && !otpSent}
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Senha</Text>
                <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder="••••••"
                    placeholderTextColor={colors.textSubtle}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!operationLoading}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                      size={20} 
                      color={colors.textSecondary} 
                    />
                  </Pressable>
                </View>
              </View>
              
              {mode === 'register' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Confirmar Senha</Text>
                    <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
                      <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                      <TextInput
                        style={[styles.input, { color: colors.textPrimary }]}
                        placeholder="••••••"
                        placeholderTextColor={colors.textSubtle}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                        editable={!operationLoading}
                      />
                    </View>
                  </View>
                  
                  {!otpSent ? (
                    <Pressable
                      style={[styles.button, { backgroundColor: colors.primary }]}
                      onPress={handleSendOTP}
                      disabled={operationLoading}
                    >
                      <Text style={[styles.buttonText, { color: colors.textWhite }]}>
                        {operationLoading ? 'Enviando...' : 'Enviar Código de Verificação'}
                      </Text>
                    </Pressable>
                  ) : (
                    <>
                      <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>
                          Código de Verificação (4 dígitos)
                        </Text>
                        <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
                          <Ionicons name="shield-checkmark-outline" size={20} color={colors.textSecondary} />
                          <TextInput
                            style={[styles.input, { color: colors.textPrimary }]}
                            placeholder="0000"
                            placeholderTextColor={colors.textSubtle}
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={4}
                            editable={!operationLoading}
                          />
                        </View>
                      </View>
                      
                      <Pressable
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={handleRegister}
                        disabled={operationLoading}
                      >
                        <Text style={[styles.buttonText, { color: colors.textWhite }]}>
                          {operationLoading ? 'Cadastrando...' : 'Criar Conta'}
                        </Text>
                      </Pressable>
                      
                      <Pressable onPress={handleSendOTP} disabled={operationLoading}>
                        <Text style={[styles.linkText, { color: colors.primary }]}>
                          Reenviar código
                        </Text>
                      </Pressable>
                    </>
                  )}
                </>
              )}
              
              {mode === 'login' && (
                <Pressable
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={handleLogin}
                  disabled={operationLoading}
                >
                  <Text style={[styles.buttonText, { color: colors.textWhite }]}>
                    {operationLoading ? 'Entrando...' : 'Entrar'}
                  </Text>
                </Pressable>
              )}
            </View>
            
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              </Text>
              <Pressable onPress={toggleMode} disabled={operationLoading}>
                <Text style={[styles.footerLink, { color: colors.primary }]}>
                  {mode === 'login' ? 'Cadastre-se' : 'Faça login'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
  },
  formCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modeSelector: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  modeButtonActive: {
    
  },
  modeButtonText: {
    ...typography.bodyMedium,
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    ...typography.captionMedium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.sm,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    ...typography.button,
  },
  linkText: {
    ...typography.captionMedium,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  footerText: {
    ...typography.caption,
  },
  footerLink: {
    ...typography.captionMedium,
  },
});
