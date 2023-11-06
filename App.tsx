import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import RootNavigator from "./src/navigators/RootNavigators";
import { queryClient } from "./src/queryClient";
import Loading from "./src/components/shared/Loading";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <QueryClientProvider client={queryClient}>
            <RootNavigator />
            <Loading />
          </QueryClientProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </>
  );
}
