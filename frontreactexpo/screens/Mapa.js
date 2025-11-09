// src/screens/MapScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken(
  'pk.eyJ1IjoiZGFya2tuaWdodDIwNjUxIiwiYSI6ImNtZmZ6aGh1ZDBjZjIycXB1dWY1cmd5YzIifQ.i_CcocClD8LXy1-JeNL7qQ'
);

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  // Obtener ubicación del usuario
  useEffect(() => {
    const getLocation = async () => {
      try {
        const granted = await Mapbox.requestAndroidLocationPermissions();
        if (!granted) {
          Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
          return;
        }

        const location = await Mapbox.locationManager.getLastKnownLocation();
        if (location) {
          setUserLocation([location.coords.longitude, location.coords.latitude]);
          fetchNearby(location.coords.longitude, location.coords.latitude);
        }
      } catch (error) {
        console.error('Error obteniendo ubicación:', error);
      }
    };

    getLocation();
  }, []);

  // Llamar al backend
  const fetchNearby = async (lng, lat) => {
    try {
      const params = new URLSearchParams({
        lng: lng.toString(),
        lat: lat.toString(),
        radius: '5000',
      });

      const res = await fetch(`http://192.168.7.190:5000/api/places/nearby?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      setPlaces(Array.isArray(data) ? data : data.places || []);
    } catch (error) {
      console.error('Error obteniendo lugares:', error);
    }
  };

  // Crear formas 3D para lugares
  const render3DShapes = () =>
    places.map((place, index) => {
      let color = '#00BCD4';
      let height = 20;
      let shapeCoords = [];

      switch (place.category) {
        case 'Tienda':
          color = '#FF9800';
          height = 50;
          shapeCoords = createCube(place.location.coordinates);
          break;
        case 'Restaurante':
          color = '#E91E63';
          height = 25;
          shapeCoords = createCube(place.location.coordinates);
          break;
        case 'Cultura':
          color = '#3F51B5';
          height = 40;
          shapeCoords = createPyramid(place.location.coordinates);
          break;
        case 'Parque':
          color = '#4CAF50';
          height = 5;
          shapeCoords = createSquare(place.location.coordinates);
          break;
        default:
          shapeCoords = createSquare(place.location.coordinates);
      }

      return (
        <Mapbox.ShapeSource
          id={`shape-${index}`}
          key={`shape-${index}`}
          shape={{
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [shapeCoords],
            },
          }}
        >
          <Mapbox.FillExtrusionLayer
            id={`extrusion-${index}`}
            style={{
              fillExtrusionColor: color,
              fillExtrusionHeight: height,
              fillExtrusionOpacity: 0.9,
            }}
          />
        </Mapbox.ShapeSource>
      );
    });

  // Utilidades para crear formas geométricas
  const createSquare = ([lng, lat], size = 0.0002) => [
    [lng - size, lat - size],
    [lng - size, lat + size],
    [lng + size, lat + size],
    [lng + size, lat - size],
    [lng - size, lat - size],
  ];

  const createCube = ([lng, lat]) => createSquare([lng, lat], 0.0003);

  const createPyramid = ([lng, lat]) => [
    [lng - 0.0003, lat - 0.0003],
    [lng, lat + 0.0004],
    [lng + 0.0003, lat - 0.0003],
    [lng - 0.0003, lat - 0.0003],
  ];

  if (!userLocation) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Street}>
        <Mapbox.Camera zoomLevel={14} centerCoordinate={userLocation} pitch={60} />
        <Mapbox.PointAnnotation id="user" coordinate={userLocation} />
        {render3DShapes()}
      </Mapbox.MapView>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#000' },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
});
