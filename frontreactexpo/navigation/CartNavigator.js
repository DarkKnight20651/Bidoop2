import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos las pantallas que creamos
import CartScreen from '../screens/cartScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createNativeStackNavigator();

// Este es el componente que conectaremos a la Tab "Carrito"
export default function CartNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Ocultamos la cabecera del Stack, ya que el Tab la tiene
        headerShown: false, 
      }}
    >
      <Stack.Screen 
        name="CarritoStack" // Nombre interno para esta pantalla 
        component={CartScreen} 
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        // Opcional: podemos mostrar cabecera para "Confirmar"
        options={{ 
          headerShown: true,
          title: 'Confirmar Pago',
          headerStyle: { backgroundColor: '#1E1E2F' },
          headerTintColor: '#FFFFFF',
        }} 
      />
    </Stack.Navigator>
  );
}