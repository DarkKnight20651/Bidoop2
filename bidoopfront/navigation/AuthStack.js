// AuthStack.js (Ejemplo)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen'; // vista en screens
a
import SignUpScreen from './screens/SignUpScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      {/* ...aqui otras pantallas de autenticación pero no se cual se agregará*/}
    </Stack.Navigator>
  );
};

export default AuthStack;