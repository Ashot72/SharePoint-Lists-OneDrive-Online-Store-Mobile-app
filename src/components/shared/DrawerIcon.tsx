import Icons from "@expo/vector-icons/MaterialIcons";
import { MEDIUMSLATEBLUE, WHITE } from "../../colors";

interface IDrawerIcon {
  focused: boolean;
  size: number;
  name: any;
}

const DrawerIcon = ({ focused, size, name }: IDrawerIcon) => (
  <Icons
    name={name}
    color={focused ? WHITE : MEDIUMSLATEBLUE}
    size={size}
  />
);

export default DrawerIcon;
