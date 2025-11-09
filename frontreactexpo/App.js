import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importaciones de tus pantallas
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductsScreen from './screens/ProductsScreen';
import CreateProductScreen from './screens/CreateScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // 👈 nuevo
// --- NUESTRA NUEVA IMPORTACIÓN ---
import CartNavigator from './navigation/CartNavigator'; // Importamos el Stack del Carrito
import MapScreen from './screens/Mapa';
const Tab = createBottomTabNavigator();
const ProductStack = createNativeStackNavigator();

// --- PANTALLAS PLACEHOLDER (Tal como las tenías) ---
function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.screenText}>Aquí es Inicio</Text>
    </SafeAreaView>
  );
}


// --- FIN DE PANTALLAS PLACEHOLDER ---

function ProductsStack() {
  return (
    <ProductStack.Navigator>
      <ProductStack.Screen
        name="Catalogo"
        component={ProductsScreen}
        options={{ title: 'Productos' }}
      />
      <ProductStack.Screen
        name="CrearProducto"
        component={CreateProductScreen}
        options={{ title: 'Crear producto' }}
      />
    </ProductStack.Navigator>
  );
}

// Tus Tabs, tal como las tenías
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E1E2F',
          borderTopColor: '#3A3A5A',
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#8888AA',
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Productos') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Mapa') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Carrito') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Productos" component={ProductsScreen} />
     <Tab.Screen name="Mapa" component={MapScreen} />
      
      {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
      {/* Ya no es 'CartScreen', ahora es el 'CartNavigator' */}
      <Tab.Screen name="Carrito" component={CartNavigator} /> 
      {/* --- FIN DEL CAMBIO --- */}

      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Tu lógica de Login, tal como la tenías
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLoginSuccess={() => {
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

// Estilos (Solo los necesarios para las placeholders)
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1E1E2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 20,
    color: '#FFFFFF',
  }
});