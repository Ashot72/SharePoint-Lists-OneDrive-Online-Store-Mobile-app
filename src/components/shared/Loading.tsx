import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { MEDIUMSLATEBLUE } from "../../colors";

const Loading = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  return (
    <>
      {(isFetching || isMutating)
        ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={MEDIUMSLATEBLUE} />
          </View>
        )
        : <View />}
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loading;
