// app/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "" || password === "") {
      Alert.alert("Campos vacíos", "Por favor ingresa tus datos");
      return;
    }

    // Simulación: login correcto
    if (email === "admin@mail.com" && password === "1234") {
      // Navega al grupo de tabs
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Credenciales incorrectas");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.appTitle}>Bidoop</Text>

      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.subtitle}>Ingresa con tu cuenta para continuar</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="tucorreo@ejemplo.com"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#6b7280"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  appTitle: {
    color: "#38bdf8",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 40,
  },
  title: {
    color: "#f9fafb",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#e5e7eb",
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#f9fafb",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#38bdf8",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  buttonText: {
    color: "#0b1120",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotText: {
    color: "#9ca3af",
    fontSize: 13,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
