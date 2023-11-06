import { useEffect, useState } from "react";
import { View } from "react-native";
import { useUser } from "../../hooks/useUsers";
import Cart from "../../components/ShoppingCart/Cart";
import { DrawerStackScreenProps } from "../../navigators/DrawerNavigator";

const CartScreen = ({}: DrawerStackScreenProps<"ShoppingCart">) => {
  const [name, setName] = useState<string>("");
  const user = useUser();

  useEffect(() => {
    if (user) {
      setName(user.userPrincipalName);
    }
  }, [user]);

  return (
    <>
      {name ? <Cart name={name} /> : <View />}
    </>
  );
};

export default CartScreen;
