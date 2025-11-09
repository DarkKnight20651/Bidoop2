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
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductsScreen from './screens/ProductsScreen';

const Tab = createBottomTabNavigator();

// --- CONFIGURACIÓN CRÍTICA ---
const YOUR_SERVER_API_URL = 'http://192.168.5.146:5000';
// --- FIN DE LA CONFIGURACIÓN ---

function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.screenText}>Aquí es Inicio</Text>
    </SafeAreaView>
  );
}

function MapScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.screenText}>Aquí es Mapa</Text>
    </SafeAreaView>
  );
}

function CartScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.screenText}>Aquí es Carrito</Text>
    </SafeAreaView>
  );
}



function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({ // 👈 screenOptions DEBE ser una función
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
        // 👇 LÓGICA DEL ICONO
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
      <Tab.Screen name="Carrito" component={CartScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}



// 👉 ESTE es ahora tu componente principal
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 👇 Mientras no esté logueado, mostrar LoginScreen
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLoginSuccess={() => {
          setIsLoggedIn(true);
        }}
      />
    );
  }

  // 👇 Cuando se loguee, mostrar pantalla de pagos
return (
  <NavigationContainer>
    <MainTabs />
  </NavigationContainer>
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
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
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
    fontWeight: '600',
  },
  successBg: {
    backgroundColor: 'rgba(0, 200, 100, 0.3)',
  },
  errorBg: {
    backgroundColor: 'rgba(255, 100, 100, 0.3)',
  },
});
