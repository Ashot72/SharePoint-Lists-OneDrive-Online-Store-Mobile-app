import { StyleSheet, View } from "react-native";
import Icons from "@expo/vector-icons/MaterialIcons";

interface IHeaderRightIcon {
  name: any;
  tintColor: string;
  onPress: () => void;
}

const HeaderRightIcon = ({ name, tintColor, onPress }: IHeaderRightIcon) => (
  <View style={styles.cotnainer}>
    <Icons
      name={name}
      color={tintColor}
      size={24}
      onPress={onPress}
    />
  </View>
);

const styles = StyleSheet.create({
  cotnainer: {
    marginRight: 15,
  },
});

export default HeaderRightIcon;
