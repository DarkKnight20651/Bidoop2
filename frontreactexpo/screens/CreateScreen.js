// screens/CreateProductScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../api/client";

export default function CreateProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [place, setPlace] = useState(""); // si después tienes un selector, mejor
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
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

      Alert.alert("Listo", "Producto creado");
      navigation.goBack(); // vuelves al catálogo
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nombre</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text>Descripción</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text>Precio</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text>ID de lugar (momentáneo)</Text>
      <TextInput style={styles.input} value={place} onChangeText={setPlace} />

      <Button title="Elegir imagen" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 150, height: 150, marginTop: 10 }}
        />
      )}

      <Button title={loading ? "Guardando..." : "Guardar producto"} onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
});
