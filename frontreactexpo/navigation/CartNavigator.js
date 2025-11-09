import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos las pantallas
import CartScreen from '../screens/CartScreen'; 
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createNativeStackNavigator();

function CartNavigator() {
  return (
    // Aseguramos que solo haya Screens dentro del Navigator, sin espacios o saltos de línea extra.
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E2F' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="CarritoStack"
        component={CartScreen}
        options={{ title: 'Carrito de Compras' }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{ title: 'Confirmar Pago' }}
      />
    </Stack.Navigator>
  );
}

export default CartNavigator;