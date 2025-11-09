import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// --- DATOS DE EJEMPLO ---
const CART_ITEMS = [
  { id: '1', name: 'Artesanía de Barro Negro', price: 1200 },
  { id: '2', name: 'Textil Bordado a Mano', price: 1800 },
];
// ---

function CartScreen({ navigation }) {
  const total = CART_ITEMS.reduce((sum, item) => sum + item.price, 0);

  const handlePaymentPress = () => {
    // Navega a la pantalla de confirmación de pago
    navigation.navigate('Payment', {
      totalAmount: total.toString(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tu Carrito</Text>
        
        {CART_ITEMS.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            {/* Asumimos que el precio está en centavos */}
            <Text style={styles.itemPrice}>${(item.price / 100).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total a Pagar:</Text>
          <Text style={styles.totalAmount}>${(total / 100).toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePaymentPress}>
          <Text style={styles.buttonText}>Pagar con Interledger</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Exportamos la pantalla y los estilos
export default CartScreen;

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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A5A',
  },
  itemName: {
    fontSize: 18,
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#AAAAFF',
  },
  totalText: {
    fontSize: 22,
    color: '#AAAAFF',
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30, // Espacio
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
});