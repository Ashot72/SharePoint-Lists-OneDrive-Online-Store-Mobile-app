import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icons from "@expo/vector-icons/MaterialIcons";
import { useDeleteCart, useUpdateCart } from "../../hooks/useCarts";
import { blobToBase64 } from "../../helper";
import { ICart } from "../../interfaces";
import { useNavigation } from "@react-navigation/native";
import { itemStyle } from "../../AppStyles";
import { useCartImage } from "../../hooks/useCarts";
import { MEDIUMSLATEBLUE } from "../../colors";
import { useProduct } from "../../hooks/useProducts";
import { queryClient } from "../../queryClient";
import { queryKeys } from "../../constants";

interface ICartItem {
  item: {
    fields: ICart;
  };
  isRefetching?: boolean;
  refetch: () => void;
}

const CartItem = ({ refetch, item, isRefetching }: ICartItem) => {
  const navigation: any = useNavigation();

  const [image, setImage] = useState<string>();
  const [count, setCount] = useState<number>(item.fields.Qty);
  const [itemClicked, setItemClicked] = useState(false);
  const [quantityClicked, setQuantityClicked] = useState(false);
  const { data: cartImage, refetch: refetchCartImage } = useCartImage(
    item.fields,
  );
  const { data: product, refetch: refetchProduct } = useProduct(
    item.fields.ProductLookupId,
  );

  const deleteCart = useDeleteCart(refetch);
  const updateCart = useUpdateCart(refetch);

  useEffect(() => {
    setCount(item.fields.Qty);
  }, [item.fields.Qty]);

  useEffect(() => {
    if (isRefetching) {
      refetchCartImage();
    }
  }, [isRefetching]);

  useEffect(() => {
    if (product && product.value && itemClicked) {
      queryClient.removeQueries({
        queryKey: [queryKeys.products, "product" + item.fields.ProductLookupId],
      });
      navigation.navigate("Product", {
        product: product.value[0].fields,
      });
    }
  }, [product, itemClicked]);

  useEffect(() => {
    (async () => {
      if (cartImage) {
        const base64 = await blobToBase64(cartImage);
        setImage(base64);
      }
    })();
  }, [cartImage]);

  useEffect(() => {
    if (quantityClicked) {
      if (count === 0) {
        deleteConfirm();
      } else {
        if (count <= item.fields.ProductCount) {
          updateCart({ id: item.fields.id, Qty: count } as ICart);
        }
      }
    }
  }, [count, quantityClicked]);

  const deleteConfirm = () => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to delete '${item.fields.Title}' cart item?`,
      [
        {
          text: "Cancel",
          onPress: () => setCount(1),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteCart(item.fields),
        },
      ],
    );
  };

  return (
    <Pressable
      style={({ pressed }) => pressed && itemStyle.pressed}
      onPress={() => {
        setItemClicked(true);
        refetchProduct();
      }}
    >
      <View
        style={[
          { aspectRatio: item.fields.ProductAspectRatio },
          itemStyle.imageContainer,
        ]}
      >
        {image &&
          (
            <Image
              source={{
                uri: image,
              }}
              resizeMode="cover"
              style={StyleSheet.absoluteFill}
            />
          )}
        <View style={{ alignItems: "center" }}>
          <Text style={itemStyle.title}>
            {item.fields.Title}
          </Text>
        </View>
        {
          <View style={itemStyle.actionsContainer}>
            <View style={itemStyle.actionSubContainer}>
              <TouchableOpacity
                onPress={() => {
                  setQuantityClicked(true);
                  setCount((count) => Math.max(0, count - 1));
                }}
                style={itemStyle.action}
              >
                <Icons name="remove" size={20} color={MEDIUMSLATEBLUE} />
              </TouchableOpacity>
              <Text
                style={itemStyle.actionValue}
              >
                {count}{" "}
                | ${(item.fields.ProductPrice * item.fields.Qty).toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setQuantityClicked(true);
                  setCount((count) =>
                    Math.min(item.fields.ProductCount, count + 1)
                  );
                }}
                style={itemStyle.action}
              >
                <Icons name="add" size={20} color={MEDIUMSLATEBLUE} />
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    </Pressable>
  );
};

export default CartItem;
