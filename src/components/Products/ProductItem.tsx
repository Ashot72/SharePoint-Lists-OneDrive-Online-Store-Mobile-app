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
import { blobToBase64 } from "../../helper";
import { useUser } from "../../hooks/useUsers";
import { ICategory, IProduct } from "../../interfaces";
import { useDeleteProduct, useProductImage } from "../../hooks/useProducts";
import { itemStyle } from "../../AppStyles";
import { MEDIUMSLATEBLUE } from "../../colors";
import { useCarts } from "../../hooks/useCarts";

interface IProductItem {
  navigation: any;
  category: ICategory;
  index: number;
  item: {
    fields: IProduct;
    createdBy?: {
      user: {
        email: string;
      };
    };
  };
  isRefetching?: boolean;
}

const ProductItem = (
  { navigation, item, category, isRefetching }: IProductItem,
) => {
  const [image, setImage] = useState<string>();
  const { data: productImage, refetch: refetchProductImage } = useProductImage(
    item.fields,
  );
  const { refetch: refetchCarts } = useCarts(
    item?.createdBy?.user.email,
  );

  const user = useUser();
  const deleteProduct = useDeleteProduct(() => refetchCarts());

  useEffect(() => {
    if (isRefetching) {
      refetchProductImage();
    }
  }, [isRefetching]);

  useEffect(() => {
    (async () => {
      if (productImage) {
        const base64 = await blobToBase64(productImage);
        setImage(base64);
      }
    })();
  }, [productImage]);

  const deleteConfirm = () => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to delete '${item.fields.Title}' product?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteProduct(item.fields),
        },
      ],
    );
  };

  return (
    <Pressable
      style={({ pressed }) => pressed && itemStyle.pressed}
      onPress={() =>
        navigation.navigate("Product", {
          product: item.fields,
        })}
    >
      <View
        style={[
          { aspectRatio: item.fields.AspectRatio },
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
          <Text style={[itemStyle.title, { fontSize: 16 }]}>
            {item.fields.Title}
          </Text>
        </View>
        {(item?.createdBy?.user.email === user?.userPrincipalName) &&
          (
            <View style={itemStyle.actionsContainer}>
              <View style={itemStyle.actionSubContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AddUpdateProduct", {
                      category: category,
                      product: item.fields,
                    })}
                  style={itemStyle.action}
                >
                  <Icons name="edit" size={20} color={MEDIUMSLATEBLUE} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={deleteConfirm}
                  style={itemStyle.action}
                >
                  <Icons name="delete" size={20} color={MEDIUMSLATEBLUE} />
                </TouchableOpacity>
              </View>
            </View>
          )}
      </View>
    </Pressable>
  );
};

export default ProductItem;
