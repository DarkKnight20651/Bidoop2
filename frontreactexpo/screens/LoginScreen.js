// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

// Cambia esta URL si tu backend está en otra IP/puerto
const API_URL = 'http://192.168.5.146:5000';

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        'Campos incompletos',
        'Por favor ingresa tu correo y contraseña.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // error de credenciales / backend
        Alert.alert(
          'Error de acceso',
          data.message || 'Correo o contraseña incorrectos.'
        );
        return;
      }

      // Login correcto
      Alert.alert('¡Bienvenida!', data.name || 'Inicio de sesión correcto.');

      if (onLoginSuccess) {
        onLoginSuccess(data); // avisamos al App que se logueó bien
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error de red',
        'No se pudo conectar con el servidor. Verifica tu IP o que el backend esté corriendo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.appTitle}>BIDOOP</Text>
          <Text style={styles.appSubtitle}>Inicia sesión para continuar</Text>

          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                placeholder="tu_correo@example.com"
                placeholderTextColor="#777A9A"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            {/* Password + Ver/Ocultar */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#777A9A"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                />
                <TouchableOpacity
                  style={styles.togglePasswordBtn}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Text style={styles.togglePasswordText}>
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E2F', // fondo oscuro como tu app
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#BBBBFF',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#2A2A4A',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#AAAAFF',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3A3A5A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#1F1F36',
    color: '#FFFFFF',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  togglePasswordBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  togglePasswordText: {
    color: '#BBBBFF',
    fontSize: 13,
    fontWeight: '500',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
