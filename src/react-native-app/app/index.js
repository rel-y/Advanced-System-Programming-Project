import { Redirect } from "expo-router";
import { ThemeProvider } from "../scheme";

export default function Index() {

  return <Redirect href="/(authentication)/login" />;
  // or: return <Redirect href="/(tabs)" />;
}