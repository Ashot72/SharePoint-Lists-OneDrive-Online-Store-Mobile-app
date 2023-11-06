import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import DrawerNavigator, { DrawerStackParamList } from "./DrawerNavigator";
import SignInScreen from "../screens/root/SignInScreen";
import ProductsScreen from "../screens/root/ProductsScreen";
import ProductScreen from "../screens/root/ProductScreen";
import AddUpdateCategoryScreen from "../screens/root/AddUpdateCategoryScreen";
import AddUpdateProductScreen from "../screens/root/AddUpdateProductScreen";
import { MEDIUMSLATEBLUE, WHITE } from "../colors";
import { ICategory, IProduct } from "../interfaces";

export type RootStackParamList = {
  DrawerStack: NavigatorScreenParams<DrawerStackParamList>;
  SignIn: undefined;
  Products: { category: ICategory; userEmail: string };
  Product: { product: IProduct };
  AddUpdateCategory: { category?: ICategory };
  AddUpdateProduct: { category: ICategory; product?: IProduct };
  Payments: undefined;
};

export const RootStack = createNativeStackNavigator<RootStackParamList>();

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

const RootNavigator = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: MEDIUMSLATEBLUE },
        headerTintColor: WHITE,
      }}
    >
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="DrawerStack"
        component={DrawerNavigator}
      />
      <RootStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: "Sign In",
        }}
      />
      <RootStack.Screen
        name="Products"
        component={ProductsScreen}
      />
      <RootStack.Screen
        name="Product"
        component={ProductScreen}
      />
      <RootStack.Screen
        name="AddUpdateCategory"
        component={AddUpdateCategoryScreen}
      />
      <RootStack.Screen
        name="AddUpdateProduct"
        component={AddUpdateProductScreen}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
