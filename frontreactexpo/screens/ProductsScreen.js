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


export default function ProductsScreen({ navigation, session }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/products' /* o la ruta que tengas */, {
          // Si tu endpoint necesita token, descomenta esto y ajusta:
          // headers: session?.token
          //   ? { Authorization: `Bearer ${session.token}` }
          //   : undefined,
        });

        // Asumo que el backend responde con un array de productos
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
  }, [session]);

const renderProduct = ({ item }) => {
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
    </View>
  );
};


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ color: '#fff', marginTop: 8 }}>Cargando productos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'tomato' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header parecido al de tu mockup */}
      <Text style={styles.subtitle}>Colores de</Text>
      <Text style={styles.title}>Alebrije Fantástico</Text>

      {/* Lista de productos en 2 columnas */}
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id || item._id)}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Botón "Añadir al Carrito" general (luego lo conectamos de verdad) */}
      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Añadir al Carrito</Text>
      </TouchableOpacity>
       {/* NUEVO: botón flotante para ir a CrearProducto */}
    <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('CrearProducto')}
    >
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
    </View>
  );
}

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
  bottom: 80, // ajústalo para que no se tape con el botón del carrito
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
    paddingBottom: 80, // espacio para el botón
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
  addToCartButton: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#FF007A',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
