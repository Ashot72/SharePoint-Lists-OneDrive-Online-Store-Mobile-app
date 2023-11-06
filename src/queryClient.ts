import { QueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

function queryErrorHandler(error: unknown) {
  const title: string = error instanceof Error
    ? error.message
    : "Error connecting to server";

  if (!title.includes("unique constraints")) {
    Alert.alert("Error", title);
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
});
