import { Pressable, StyleSheet, Text, View } from "react-native";
import { BLACK, MEDIUMSLATEBLUE, WHITE } from "../../colors";

const Button = ({ children, onPress, mode = "normal", style }) => {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={[styles.button, mode === "flat" && styles.flat]}>
          <Text style={[styles.buttonText, mode === "flat" && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    padding: 8,
    backgroundColor: MEDIUMSLATEBLUE,
  },
  flat: {
    backgroundColor: "transparent",
  },
  buttonText: {
    textAlign: "center",
    color: WHITE,
    fontSize: 16,
  },
  flatText: {
    color: BLACK,
  },
  pressed: {
    opacity: 0.5,
    backgroundColor: MEDIUMSLATEBLUE,
    borderRadius: 6,
  },
});

export default Button;
