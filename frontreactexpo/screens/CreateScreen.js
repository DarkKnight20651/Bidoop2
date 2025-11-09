// screens/CreateProductScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/client";

export default function CreateProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [place, setPlace] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage(asset);
    }
  };

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert("Faltan datos", "Nombre y precio son obligatorios");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);

      if (image) {
        formData.append("image", {
          uri: image.uri,
          name: "photo.jpg",
          type: "image/jpeg",
        });
      }

      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("¡Éxito!", "Producto creado correctamente");
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      
      

      {/* Image Upload Section */}
      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>                         Imagen del Producto</Text>
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={styles.productImage}
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="camera-outline" size={40} color="#A0522D" />
              <Text style={styles.uploadText}>Agregar imagen</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Información del Producto</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del producto *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Jarro de barro negro"
            placeholderTextColor="#353333ff"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe tu producto..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Precio *</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={[styles.input, styles.priceInput]}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            style={styles.input}
            value={place}
            onChangeText={setPlace}
            placeholder="Lugar de origen"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity 
        style={[
          styles.saveButton,
          loading && styles.saveButtonDisabled
        ]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.saveButtonText}>Publicar Producto</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5E6D3",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#5694daff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4e9ee9ff",
  },
  placeholder: {
    width: 40,
  },
  imageSection: {
    padding: 20,
    backgroundColor: "#FFF",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B4513",
    marginBottom: 15,
  },
  imageUpload: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E8D5B5",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDF8F0",
  },
  uploadText: {
    marginTop: 8,
    fontSize: 12,
    color: "#002b11ff",
  },
  formSection: {
    padding: 20,
    backgroundColor: "#FFF",
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#654321",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8D5B5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#FFFDFA",
    color: "#333",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a5c06ff",
    marginRight: 8,
    marginBottom: 8,
  },
  priceInput: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#34bce1ff",
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B4513",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});