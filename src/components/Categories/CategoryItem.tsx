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
import { useCategoryImage, useDeleteCategory } from "../../hooks/useCategories";
import { blobToBase64 } from "../../helper";
import { useUser } from "../../hooks/useUsers";
import { ICategory } from "../../interfaces";
import { itemStyle } from "../../AppStyles";
import { MEDIUMSLATEBLUE } from "../../colors";

interface ICategoryItem {
  navigation: any;
  item: {
    fields: ICategory;
    createdBy?: {
      user: {
        email: string;
      };
    };
  };
  isRefetching?: boolean;
  readOnly: boolean;
  refetch?: () => void;
}

const CategoryItem = (
  { navigation, item, isRefetching, readOnly, refetch }: ICategoryItem,
) => {
  const [image, setImage] = useState<string>();
  const { data: categoryImage, refetch: refetchCategoryImage } =
    useCategoryImage(item.fields);

  const user = useUser();
  const deleteCategory = useDeleteCategory(refetch!);

  useEffect(() => {
    refetchCategoryImage();
  }, []);

  useEffect(() => {
    if (isRefetching && !readOnly) {
      refetchCategoryImage();
    }
  }, [isRefetching, readOnly]);

  useEffect(() => {
    (async () => {
      if (categoryImage) {
        const base64 = await blobToBase64(categoryImage);
        setImage(base64);
      }
    })();
  }, [categoryImage]);

  const deleteConfirm = () => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to delete '${item.fields.Title}' category?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteCategory(item.fields),
        },
      ],
    );
  };

  return (
    <Pressable
      style={({ pressed }) => pressed && !readOnly && itemStyle.pressed}
      onPress={() =>
        navigation.navigate("Products", {
          category: item.fields,
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
          <Text style={itemStyle.title}>
            {item.fields.Title}
          </Text>
        </View>
        {(item?.createdBy?.user.email === user?.userPrincipalName) &&
          !readOnly &&
          (
            <View style={itemStyle.actionsContainer}>
              <View style={itemStyle.actionSubContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AddUpdateCategory", {
                      category: item.fields,
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

export default CategoryItem;
