import { View, Text } from "react-native";
export default function HomeScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Inicio</Text>
      <Text style={styles.screenText}>
        Aquí irá el contenido principal después del login.
      </Text>
    </View>
  );
}
