import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';

// --- CONFIGURACIÓN CRÍTICA ---
// 1. Reemplaza esta IP con la IP de tu computadora (del Paso 2).
// 2. Asegúrate de que el puerto sea 5000 (donde corre tu backend).
const YOUR_SERVER_API_URL = 'http://192.168.38.236:5000'; 
// --- FIN DE LA CONFIGURACIÓN ---


export default function App() {
  const [amount, setAmount] = useState('3000');
  const [receiverUrl, setReceiverUrl] = useState('https://ilp.interledger-test.dev/compradoradrian');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePayment = async () => {
    if (!receiverUrl || !amount) {
      setMessage('Error: Por favor, ingresa la URL y el monto.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Esta es la URL completa de tu API
      const apiUrl = `${YOUR_SERVER_API_URL}/api/payments/create`;
      console.log("Intentando llamar a:", apiUrl);

      // Esta API espera: { receiverWalletUrl: "...", amount: "..." }
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverWalletUrl: receiverUrl,
          amount: amount,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Pago exitoso:', result.payment);
        setMessage(
          `¡Pago exitoso!\nID: ${result.payment.id}\nMonto enviado: ${result.payment.debitAmount.value}`
        );
      } else {
        throw new Error(result.error || 'Ocurrió un error en el servidor.');
      }
    } catch (error) {
      console.error(error);
      // El error 'Network request failed' casi siempre significa
      // que la IP es incorrecta o el backend no está corriendo.
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>BIDOOP</Text>
        <Text style={styles.subtitle}>Demo de Pago Interledger</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enviar a (Billetera Receptora)</Text>
          <TextInput
            style={styles.input}
            value={receiverUrl}
            onChangeText={setReceiverUrl}
            placeholder="https://wallet.example.com/usuario"
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Monto (unidad mínima)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="3000"
            keyboardType="numeric"
          />
        </View>

        {message && (
          <View style={[
            styles.messageContainer,
            message.startsWith('Error') ? styles.errorBg : styles.successBg
          ]}>
            <Text style={styles.messageText}>
              {message}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handlePayment}>
              <Text style={styles.buttonText}>Pagar con Interledger</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E2F', // Fondo oscuro
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#BBBBFF',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#AAAAFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#3A3A5A',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#2A2A4A',
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF', // Azul vibrante
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    fontWeight: '600'
  },
  successBg: {
    backgroundColor: 'rgba(0, 200, 100, 0.3)',
  },
  errorBg: {
    backgroundColor: 'rgba(255, 100, 100, 0.3)',
  },
});