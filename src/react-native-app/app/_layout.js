import { Stack } from "expo-router";
import { ThemeProvider } from "../scheme";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='(authentication)' options={{ headerShown: false }} />
    </Stack>
  );
}
