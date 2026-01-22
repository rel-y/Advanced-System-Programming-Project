import { Stack } from "expo-router";
import { ThemeProvider } from "../scheme";
import Login from "./(authentication)/login";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{headerShown: false}}/>
    </ThemeProvider>
  );
}
