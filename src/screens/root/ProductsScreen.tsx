import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import MasonryList from "reanimated-masonry-list";
import HeaderRightIcon from "../../components/shared/HeaderRightIcon";
import { ICategory } from "../../interfaces";
import { RootStackScreenProps } from "../../navigators/RootNavigators";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import CategoryItem from "../../components/Categories/CategoryItem";
import ProductItem from "../../components/Products/ProductItem";
import HorizontalList from "../../components/shared/HorizontalList";

const ProductsScreen = (
  { navigation, route }: RootStackScreenProps<"Products">,
) => {
  let category: ICategory = route.params.category;

  const [categoryIndex, setCategoryIndex] = useState(0);
  const { data: products, refetch, isRefetching } = useProducts(category.id!);
  const { data: categories } = useCategories();

  useEffect(() => {
    const index: number = categories!.value.findIndex((c) =>
      c.fields.id == category.id
    );
    setCategoryIndex(index);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        <HeaderRightIcon
          name="add"
          tintColor={tintColor}
          onPress={() =>
            navigation.navigate("AddUpdateProduct", {
              category,
            })}
        />
      ),
    });
  }, []);

  const navigate = (id: number) => {
    const item: any = categories!.value.find((c) => c.fields.id == id);

    if (item) {
      navigation.replace("Products", {
        category: item.fields,
        userEmail: "",
      });
    }
  };

  return (
    <ScrollView>
      {/* Category */}
      <View style={{ paddingHorizontal: 70, paddingVertical: 6 }}>
        <CategoryItem
          readOnly={true}
          navigation={navigation}
          item={{ fields: category }}
        />
      </View>
      {/* Categories */}
      {categories &&
        (
          <HorizontalList
            data={categories.value}
            itemIndex={categoryIndex}
            navigate={navigate}
            column="Title"
          />
        )}
      {/* Products */}
      {products &&
        (
          <MasonryList
            onRefresh={refetch}
            data={products.value}
            numColumns={products.value.length === 1 ? 1 : 2}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, i }: any) => (
              <View style={{ padding: 6 }}>
                <ProductItem
                  index={i}
                  navigation={navigation}
                  item={item}
                  category={category}
                  isRefetching={isRefetching}
                />
              </View>
            )}
          />
        )}
    </ScrollView>
  );
};

export default ProductsScreen;
