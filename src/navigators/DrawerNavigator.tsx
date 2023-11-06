import { createDrawerNavigator } from "@react-navigation/drawer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import RegistrationScreen from "../screens/drawer/RegistrationScreen";
import CategoriesScreen from "../screens/drawer/CategoriesScreen";
import { MEDIUMSLATEBLUE, WHITE } from "../colors";
import DrawerIcon from "../components/shared/DrawerIcon";
import { useIsSignedIn } from "../hooks/useUsers";
import CartScreen from "../screens/drawer/CartScreen";
import PaymentsScreen from "../screens/drawer/PaymentsScreen";

export type DrawerStackParamList = {
  Home: undefined;
  Registration: undefined;
  Categories: undefined;
  ShoppingCart: undefined;
  Payments: undefined;
};

export const DrawerStack = createDrawerNavigator<DrawerStackParamList>();

export type DrawerStackScreenProps<T extends keyof DrawerStackParamList> =
  NativeStackScreenProps<DrawerStackParamList, T>;

const DrawerNavigator = () => {
  const isSignedIn: boolean = useIsSignedIn();

  return (
    <DrawerStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: MEDIUMSLATEBLUE },
        headerTintColor: WHITE,

        drawerActiveTintColor: WHITE,
        drawerActiveBackgroundColor: MEDIUMSLATEBLUE,
        drawerInactiveTintColor: MEDIUMSLATEBLUE,
      }}
    >
      {
        <DrawerStack.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{
            title: "Home",
            unmountOnBlur: true,
            drawerIcon: ({ focused, size }) => (
              <DrawerIcon focused={focused} size={size} name="category" />
            ),
          }}
        />
      }
      {
        <DrawerStack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{
            unmountOnBlur: true,
            drawerIcon: ({ focused, size }) => (
              <DrawerIcon
                focused={focused}
                size={size}
                name="app-registration"
              />
            ),
          }}
        />
      }
      {isSignedIn &&
        (
          <DrawerStack.Screen
            name="ShoppingCart"
            component={CartScreen}
            options={{
              unmountOnBlur: true,
              title: "Shopping Cart",
              drawerIcon: ({ focused, size }) => (
                <DrawerIcon
                  focused={focused}
                  size={size}
                  name="shopping-cart"
                />
              ),
            }}
          />
        )}
      {isSignedIn &&
        (
          <DrawerStack.Screen
            name="Payments"
            component={PaymentsScreen}
            options={{
              unmountOnBlur: true,
              title: "Orders",
              drawerIcon: ({ focused, size }) => (
                <DrawerIcon focused={focused} size={size} name="attach-money" />
              ),
            }}
          />
        )}
    </DrawerStack.Navigator>
  );
};

export default DrawerNavigator;
