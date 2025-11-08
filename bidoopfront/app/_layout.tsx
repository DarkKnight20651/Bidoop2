// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="login">
      {/* Pantalla de login */}
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />

      {/* Grupo de tabs que ya trae el template */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
