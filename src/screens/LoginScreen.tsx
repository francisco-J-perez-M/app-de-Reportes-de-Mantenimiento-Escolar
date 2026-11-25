import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { reportService } from '../services/reportService';
import { colors, styles } from '../styles';
import { UserSession } from '../types';

interface LoginScreenProps {
  onLogin: (session: UserSession) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const autocomplete = (role: 'student' | 'admin') => {
    setEmail(role === 'student' ? 'alumno@utvt.edu.mx' : 'admin@utvt.edu.mx');
    setPassword('123456');
    setError('');
  };

  const submit = async () => {
    const normalizedEmail = email.trim();
    console.info('[auth] Intento de inicio de sesión:', normalizedEmail);
    if (!normalizedEmail || !password) {
      setError('Completa el correo y la contraseña.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Escribe un correo electrónico válido.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      onLogin(await reportService.login(normalizedEmail, password));
    } catch (loginError) {
      console.warn('[auth] Error de autenticación:', loginError);
      setError(loginError instanceof Error ? loginError.message : 'No fue posible iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.content, { flexGrow: 1, justifyContent: 'center' }]}>
      <View style={[styles.card, { padding: 24 }]}>
        <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700', letterSpacing: 1 }}>UTVT · SERVICIOS ESCOLARES</Text>
        <Text style={[styles.heading, { marginTop: 12 }]}>Reportes de mantenimiento</Text>
        <Text style={[styles.muted, { marginTop: 8 }]}>Inicia sesión para consultar o registrar incidencias en tu escuela.</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          accessibilityLabel="Correo electrónico"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="nombre@utvt.edu.mx"
          style={styles.input}
          value={email}
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          accessibilityLabel="Contraseña"
          onChangeText={setPassword}
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <TouchableOpacity disabled={loading} onPress={submit} style={[styles.button, { marginTop: 20 }]}>
          {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Iniciar sesión</Text>}
        </TouchableOpacity>

        <Text style={[styles.label, { marginTop: 22 }]}>Autocompletar credenciales de prueba</Text>
        <View style={[styles.row, { gap: 8 }]}>
          <TouchableOpacity accessibilityLabel="Autocompletar credenciales de estudiante" onPress={() => autocomplete('student')} style={[styles.button, styles.secondaryButton, { flex: 1 }]}>
            <Text style={styles.secondaryButtonText}>Estudiante</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Autocompletar credenciales de administrativo" onPress={() => autocomplete('admin')} style={[styles.button, styles.secondaryButton, { flex: 1 }]}>
            <Text style={styles.secondaryButtonText}>Administrativo</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.muted, { fontSize: 12, marginTop: 12 }]}>
          Estudiante: alumno@utvt.edu.mx / 123456{'\n'}
          Administrativo: admin@utvt.edu.mx / 123456
        </Text>
      </View>
    </ScrollView>
  );
}
