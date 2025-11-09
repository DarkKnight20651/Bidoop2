// screens/ProductsScreen.js
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import api from '../api/client';
import { Ionicons } from '@expo/vector-icons';
import {  useFocusEffect } from '@react-navigation/native';
export default function ProductsScreen({ navigation, session }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
useFocusEffect(
        React.useCallback(() => {
            const fetchProducts = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const response = await api.get('/products' /* o la ruta que tengas */, {
                        // Si tu endpoint necesita token, descomenta esto y ajusta:
                        // headers: session?.token
                        //   ? { Authorization: Bearer ${session.token} }
                        //   : undefined,
                    });

                    // Ajusta "response.data" si tu API envuelve datos en { products: [...] }
                    setProducts(response.data);
                } catch (err) {
                    console.log('Error al cargar productos:', err);
                    setError('No pudimos cargar los productos.');
                } finally {
                    setLoading(false);
                }
            };

            fetchProducts();

            // Retorno opcional para limpieza (no hace falta aquí)
            return () => {};
        }, [session]) // Dependencia: si session cambia, también se recarga
    );
  // Obtener productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/products');

        // Si tu backend devuelve { products: [...] } cambia esto:
        // setProducts(response.data.products);
        setProducts(response.data);

      } catch (err) {
        console.log('Error al cargar productos:', err);
        setError('No pudimos cargar los productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [session]);

  // ✅ Agregar producto al carrito
  // ✅ Agregar producto al carrito
const addToCart = async (productId) => {
  console.log("📌 ID ENVIADO AL BACKEND:", productId);

  if (!productId) {
    alert("Error: producto sin ID ❌");
    return;
  }

  try {
    const res = await api.post('/cart/items', {
      productId,
      quantity: 1,
    });

    console.log("✅ RESPUESTA DEL BACKEND:", res.data);

    alert("Producto agregado al carrito ✅");

  } catch (error) {
    console.log("🚨 ERROR COMPLETO:", error?.response?.data || error);

    alert("No se pudo agregar al carrito ❌");
  }
};


  // ✅ Renderiza cada card de producto
  const renderProduct = ({ item }) => {
    const productId = item._id || item.id; // ✅ FIX

    return (
      <View style={styles.card}>
        {item.url ? (
          <Image source={{ uri: item.url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>Sin imagen</Text>
          </View>
        )}

        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>

        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() => addToCart(productId)}
        >
          <Text style={styles.btnAddText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    );
  };


  // ✅ Loading UI
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ color: '#fff', marginTop: 8 }}>Cargando productos...</Text>
      </View>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'tomato' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.subtitle}>Colores de</Text>
      <Text style={styles.title}>Alebrije Fantástico</Text>

      {/* Lista de productos */}
      <FlatList
        data={products}
        keyExtractor={(item) => String(item._id || item.id)}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {/* FAB para crear productos */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CrearProducto')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// ✅ ESTILOS COMPLETOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF007A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  center: {
    flex: 1,
    backgroundColor: '#1E1E2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    color: '#00804A',
    fontWeight: '800',
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
  },
  imagePlaceholder: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#777',
    fontSize: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5A2B82',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF8A00',
  },
  btnAdd: {
    marginTop: 10,
    backgroundColor: '#FF007A',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnAddText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#FF007A',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    elevation: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
