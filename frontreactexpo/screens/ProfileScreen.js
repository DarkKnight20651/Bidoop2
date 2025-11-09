// src/screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getProfile } from '../api/userApi';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile(); // hace GET /users/profile con token
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError('Error cargando perfil (¿token inválido?)');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={{ padding: 16 }}>
      <Text>Nombre: {profile.name}</Text>
      <Text>Email: {profile.email}</Text>
      <Text>Puntos: {profile.points}</Text>
    </View>
  );
}
