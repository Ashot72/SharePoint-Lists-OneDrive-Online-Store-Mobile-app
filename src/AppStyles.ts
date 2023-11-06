import { StyleSheet } from "react-native";
import { BLACK, LIGHTMEDIUMSLATEBLUE, MEDIUMSLATEBLUE, WHITE } from "./colors";

const formStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "WHITE",
  },
  formContainer: {
    marginHorizontal: 15,
    marginTop: 50,
    padding: 15,
    borderRadius: 10,
    backgroundColor: LIGHTMEDIUMSLATEBLUE,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    marginBottom: 20,
    padding: 10,
    flex: 1,
  },
  input: {
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: MEDIUMSLATEBLUE,
  },
  aspectRationContainer: {
    marginTop: 14,
  },
  aspectRatio: {
    fontWeight: "bold",
  },
  imageContainer: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    marginBottom: 20,
    borderRadius: 10,
  },
});

const itemStyle = StyleSheet.create({
  imageContainer: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
  },
  title: {
    padding: 12,
    fontSize: 28,
    color: WHITE,
    textShadowColor: BLACK,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  actionsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    bottom: 5,
    marginRight: 5,
  },
  actionSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: MEDIUMSLATEBLUE,
    padding: 6,
    borderRadius: 100,
  },
  action: {
    backgroundColor: WHITE,
    width: 34,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 34,
  },
  actionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: WHITE,
  },
  actionsIcon: {
    paddingHorizontal: 6,
  },
  pressed: {
    opacity: 0.75,
  },
});

export { formStyle, itemStyle };
