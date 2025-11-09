import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken(
  'pk.eyJ1IjoiZGFya2tuaWdodDIwNjUxIiwiYSI6ImNtZmZ6aGh1ZDBjZjIycXB1dWY1cmd5YzIifQ.i_CcocClD8LXy1-JeNL7qQ'
);

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [routeVisible, setRouteVisible] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);
  const [itinerary, setItinerary] = useState([]);

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

      const res = await fetch(`http://192.168.36.201:5000/api/places/nearby?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

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
            properties: {
              name: place.name,
              category: place.category,
              description: place.description,
            },
          }}
          onPress={() => handlePlacePress(place)}
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

  // Generar una ruta turística
  const generateRoute = () => {
    if (places.length === 0) return Alert.alert('No hay lugares disponibles');

    const selected = [...places].sort(() => 0.5 - Math.random()).slice(0, 5);

    const startTime = 9; // 9:00 AM
    const itineraryTemp = selected.map((place, i) => {
      const hour = startTime + i * 1.5;
      const h = Math.floor(hour);
      const m = (hour % 1.5) === 0 ? '00' : '30';
      return {
        name: place.name,
        category: place.category,
        hour: `${h}:${m} AM`,
        coordinates: place.location.coordinates,
      };
    });

    setItinerary(itineraryTemp);
    setRouteCoords(itineraryTemp.map(p => p.coordinates));
    setRouteVisible(true);
  };

  // Cuando el usuario toca un lugar
  const handlePlacePress = (place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  // Formas geométricas
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

        {routeVisible && (
          <Mapbox.ShapeSource
            id="route"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeCoords,
              },
            }}
          >
            <Mapbox.LineLayer
              id="routeLine"
              style={{
                lineColor: '#FF5722',
                lineWidth: 4,
                lineOpacity: 0.8,
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>

      {/* Botón para generar ruta */}
      <View style={styles.bottomContainer}>
        <Pressable style={styles.routeButton} onPress={generateRoute}>
          <Text style={styles.routeButtonText}> Generar Ruta Turística</Text>
        </Pressable>
      </View>

      {/* Modal para mostrar detalles del lugar */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedPlace?.name}</Text>
            <Text style={styles.modalCategory}>
              Tipo: {selectedPlace?.category}
            </Text>
            <Text style={styles.modalDescription}>
              {selectedPlace?.description || 'Sin descripción disponible'}
            </Text>

            {selectedPlace?.category === 'donation' && (
              <Pressable
                style={styles.donateButton}
                onPress={() => Alert.alert('Gracias por tu interés', 'Aquí iría el enlace de donación')}
              >
                <Text style={styles.donateText}> Donar</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal para itinerario */}
      {routeVisible && (
        <Modal
          visible={routeVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setRouteVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.itineraryContainer}>
              <Text style={styles.modalTitle}>🗓️ Itinerario Turístico</Text>
              <ScrollView>
                {itinerary.map((item, idx) => (
                  <View key={idx} style={styles.itineraryItem}>
                    <Text style={styles.itineraryTime}>{item.hour}</Text>
                    <Text style={styles.itineraryText}>
                      {item.name} ({item.category})
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <Pressable
                style={styles.closeButton}
                onPress={() => setRouteVisible(false)}
              >
                <Text style={styles.closeText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#000' },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  routeButton: {
    backgroundColor: '#18012bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 6,
  },
  routeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  itineraryContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  itineraryItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  itineraryTime: { fontWeight: 'bold', color: '#FF5722' },
  itineraryText: { fontSize: 15, color: '#333' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  modalCategory: { fontSize: 16, color: '#555', marginBottom: 6 },
  modalDescription: { fontSize: 14, color: '#666', marginBottom: 20 },
  closeButton: {
    backgroundColor: '#4e087cff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeText: { color: '#fff', fontWeight: 'bold' },
  donateButton: {
    backgroundColor: '#061a47ff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  donateText: { color: '#fff', fontWeight: 'bold' },
});
