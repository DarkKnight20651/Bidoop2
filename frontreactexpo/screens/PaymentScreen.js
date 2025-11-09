import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';

// --- CONFIGURACIÓN CRÍTICA ---
// Aquí puedes poner tu IP directamente
<<<<<<< HEAD
const YOUR_SERVER_API_URL = 'http://192.168.38.182:5000'; // <-- ¡PON TU IP AQUÍ!
=======
const YOUR_SERVER_API_URL = 'http://192.168.36.201:5000'; // <-- ¡PON TU IP AQUÍ!
>>>>>>> bf978acccd7155e767c5a927d26fd53491f865ba
// --- FIN DE LA CONFIGURACIÓN ---

function PaymentScreen({ route, navigation }) {
  const { totalAmount } = route.params;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // Esta variable ahora usa la constante de este archivo
      const apiUrl = `${YOUR_SERVER_API_URL}/api/payments/create`;
      console.log("Pidiendo URL de aprobación a:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount, // El backend ya sabe quién es el vendedor
        }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.paymentUrl) {
        console.log('URL de aprobación recibida:', result.paymentUrl);
        
        // Redirección automática al navegador
        try {
          setLoading(false);
          await Linking.openURL(result.paymentUrl);
          // Después de abrir el enlace, volvemos al carrito.
          navigation.navigate('CarritoStack'); // Volvemos a la pantalla del carrito
        } catch (err) {
          throw new Error("No se pudo abrir el navegador para el pago.");
        }

      } else {
        throw new Error(result.error || 'Ocurrió un error en el servidor.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`Error: ${error.message}`);
      setLoading(false); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.subtitle}>Confirmar Transacción</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pagarás a (Vendedor):</Text>
          <TextInput
            style={styles.input}
            value="Yahir Artesano" // Vendedor Fijo
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Monto Total (unidad mínima):</Text>
          <TextInput
            style={styles.input}
            value={totalAmount}
            editable={false}
          />
        </View>

        {errorMessage && (
          <View style={styles.errorBg}>
            <Text style={styles.messageText}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handlePayment}>
              <Text style={styles.buttonText}>Confirmar y Pagar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PaymentScreen;

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E2F',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 24,
    color: '#BBBBFF',
    marginBottom: 30,
    textAlign: 'center'
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
    color: '#888',
  },
  buttonContainer: {
    marginTop: 20,
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorBg: {
    backgroundColor: 'rgba(255, 100, 100, 0.3)',
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
});