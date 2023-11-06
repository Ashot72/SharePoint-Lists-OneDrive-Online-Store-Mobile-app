import { useEffect, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import Icons from "@expo/vector-icons/MaterialIcons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ICart, IProduct } from "../../interfaces";
import { RootStackScreenProps } from "../../navigators/RootNavigators";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BLACK,
  GRAY,
  LIGHTGRAY,
  MEDIUMSLATEBLUE,
  RED,
  WHITE,
} from "../../colors";
import { useProductImage } from "../../hooks/useProducts";
import { blobToBase64 } from "../../helper";
import HeaderRightIcon from "../../components/shared/HeaderRightIcon";
import { useUser } from "../../hooks/useUsers";
import { useAddCart } from "../../hooks/useCarts";
import { itemStyle } from "../../AppStyles";

const ProductsScreen = (
  { navigation, route }: RootStackScreenProps<"Product">,
) => {
  let product: IProduct = route.params.product;
  const user = useUser();

  const onSuccess = () => (navigation as any).navigate("ShoppingCart");

  const addCart = useAddCart(onSuccess);

  const [image, setImage] = useState<string>();
  const { data: productImage } = useProductImage(product);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        <HeaderRightIcon
          name="close"
          tintColor={tintColor}
          onPress={() => navigation.pop()}
        />
      ),
    });
  }, []);

  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      if (productImage) {
        const base64 = await blobToBase64(productImage);
        setImage(base64);
      }
    })();
  }, [productImage]);

  const addToCart = async () => {
    const cart = {
      id: product.id,
      Title: product.Title,
      Qty: count,
      CategoryLookupId: product.CategoryLookupId,
      ProductPriceLookupId: product.id,
      ProductCountLookupId: product.id,
      ProductAspectRatioLookupId: product.id,
      ProductLookupId: product.id,
      PrincipalName: user!.userPrincipalName,
      DriveFolder: product.DriveFolder,
      DriveId: product.DriveId,
      ItemId: product.ItemId,
      WebUrl: product.WebUrl,
    } as ICart;

    addCart(cart);
  };

  return (
    <View style={styles.container}>
      {image &&
        (
          <Image
            source={{
              uri: image,
            }}
            resizeMode="contain"
            style={StyleSheet.absoluteFill}
          />
        )}
      <BottomSheet
        detached
        snapPoints={[94, 440]}
        index={0}
        style={{ marginHorizontal: 20 }}
        bottomInset={insets.bottom + 10}
        backgroundStyle={{
          borderRadius: 24,
          backgroundColor: LIGHTGRAY,
        }}
        handleIndicatorStyle={{
          backgroundColor: GRAY,
        }}
      >
        <View style={styles.itemsContainer}>
          <Text style={styles.category}>
            {product.Category}
          </Text>
          <Text style={styles.product}>
            {product && product.Title}
          </Text>
          <View style={styles.itemsSubContainer}>
            <View>
              <Text style={styles.price}>
                Price: ${product.Price}
              </Text>
              <Text
                style={[
                  styles.itemsRrmaining,
                  { color: product.Count > 5 ? GRAY : RED },
                ]}
              >
                {product.Count} items remaining
              </Text>
            </View>
            <View
              style={[itemStyle.actionsContainer, { marginBottom: -6 }]}
            >
              <View style={itemStyle.actionSubContainer}>
                <TouchableOpacity
                  onPress={() => setCount((count) => Math.max(0, count - 1))}
                  style={itemStyle.action}
                >
                  <Icons name="remove" size={20} color={MEDIUMSLATEBLUE} />
                </TouchableOpacity>
                <Text
                  style={itemStyle.actionValue}
                >
                  {count}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setCount((count) => Math.min(product.Count, count + 1))}
                  style={itemStyle.action}
                >
                  <Icons name="add" size={20} color={MEDIUMSLATEBLUE} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <Text style={styles.product}>
              Total:
              <Text style={styles.total}>
                $ {(product.Price * count).toFixed(2)}
              </Text>
            </Text>
          </View>
          <View>
            <Text
              style={styles.descriptionTitle}
            >
              Description
            </Text>
            <Text
              style={styles.description}
              numberOfLines={5}
            >
              {product.Description}
            </Text>
          </View>
          <View
            style={[
              styles.addToCartContainer,

              { opacity: count > 0 ? 1 : 0.5 },
            ]}
          >
            <Text
              style={styles.addToCartTitle}
            >
              Add to Cart
            </Text>
            <View
              style={styles.addToCartArrowContainer}
            >
              {count > 0
                ? (
                  <TouchableOpacity onPress={addToCart}>
                    <Icons
                      name="arrow-forward"
                      size={24}
                      color={MEDIUMSLATEBLUE}
                    />
                  </TouchableOpacity>
                )
                : (
                  <Icons
                    name="arrow-forward"
                    size={24}
                    color={MEDIUMSLATEBLUE}
                  />
                )}
            </View>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  category: {
    fontSize: 20,
    fontWeight: "600",
    color: MEDIUMSLATEBLUE,
    alignSelf: "center",
  },
  product: {
    marginRight: 13,
    fontSize: 16,
    color: GRAY,
  },
  itemsContainer: {
    padding: 16,
    gap: 16,
    flex: 1,
  },
  itemsSubContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starRatings: {
    flexDirection: "row",
    gap: 2,
  },
  itemsRrmaining: {
    fontSize: 14,
    opacity: 0.75,
  },
  descriptionTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: BLACK,
    alignSelf: "center",
  },
  description: {
    color: BLACK,
    opacity: 0.75,
    height: 85,
  },
  price: {
    fontSize: 14,
    fontStyle: "italic",
  },
  total: {
    fontWeight: "600",
    color: RED,
  },
  addToCartContainer: {
    backgroundColor: MEDIUMSLATEBLUE,
    height: 64,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: WHITE,
  },
  addToCartArrowContainer: {
    backgroundColor: WHITE,
    width: 40,
    aspectRatio: 1,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 12,
    right: 12,
    bottom: 12,
  },
});

export default ProductsScreen;
