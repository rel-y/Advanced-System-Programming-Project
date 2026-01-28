import { Redirect } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
export default function Index() {

  return <Redirect href="/(authentication)/login" />;
}