import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import api from '../api/client';

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Cargar carrito desde el backend
  const loadCart = async () => {
    try {
      const res = await api.get('/cart'); // protect ya mete req.user
      setCart(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.log("Error cargando carrito:", error.response?.data);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Actualizar cantidad (+ / -)
  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity < 1) return;
      await api.put(`/cart/items/${itemId}`, { quantity });
      loadCart();
    } catch (err) {
      console.log("Error actualizando cantidad:", err.response?.data);
    }
  };

  // Eliminar producto del carrito
  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      loadCart();
    } catch (err) {
      console.log("Error eliminando:", err.response?.data);
    }
  };

  // Navegar a la pantalla de pago
  const handlePaymentPress = () => {
    navigation.navigate("Payment", {
      totalAmount: total.toString(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Tu Carrito</Text>

        {cart.length === 0 && (
          <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
        )}

        {cart.map((item) => (
          <View key={item._id} style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>

            <View style={styles.quantityBox}>
              <TouchableOpacity
                onPress={() => updateQuantity(item._id, item.quantity - 1)}
              >
                <Text style={styles.qtyBtn}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qty}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => updateQuantity(item._id, item.quantity + 1)}
              >
                <Text style={styles.qtyBtn}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.itemPrice}>${item.subtotal}</Text>

            {/* Botón eliminar */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeItem(item._id)}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Total */}
        {cart.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total a Pagar:</Text>
            <Text style={styles.totalAmount}>${total}</Text>
          </View>
        )}

        {/* Botón de pago */}
        {cart.length > 0 && (
          <TouchableOpacity style={styles.button} onPress={handlePaymentPress}>
            <Text style={styles.buttonText}>Pagar con Interledger</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

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
  emptyText: {
    color: '#aaa',
    fontSize: 18,
    marginTop: 20,
  },

  cartItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A5A',
    paddingVertical: 14,
  },

  itemName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
  },

  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  qtyBtn: {
    fontSize: 22,
    color: '#fff',
    paddingHorizontal: 10,
  },

  qty: {
    fontSize: 18,
    color: '#fff',
    marginHorizontal: 8,
  },

  itemPrice: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 5,
  },

  deleteBtn: {
    marginTop: 8,
  },

  deleteText: {
    color: '#FF4C4C',
    fontWeight: 'bold',
    fontSize: 15,
  },

  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
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
    marginTop: 30,
    shadowColor: '#000',
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
