import { useEffect } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import MasonryList from "reanimated-masonry-list";
import HeaderRightIcon from "../../components/shared/HeaderRightIcon";
import { useCategories } from "../../hooks/useCategories";
import CategoryItem from "../../components/Categories/CategoryItem";
import { DrawerStackScreenProps } from "../../navigators/DrawerNavigator";

const CategoriesScreen = (
  { navigation }: DrawerStackScreenProps<"Categories">,
) => {
  const isFocused = useIsFocused();
  const { data: categories, refetch, isRefetching } = useCategories();

  useEffect(() => {
    refetch();
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        <HeaderRightIcon
          name="add"
          tintColor={tintColor}
          onPress={() => (navigation as any).navigate("AddUpdateCategory")}
        />
      ),
    });
  }, []);

  return (
    <>
      {categories &&
        (
          <MasonryList
            onRefresh={refetch}
            data={categories.value}
            numColumns={1}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }: any) => (
              <View style={{ padding: 6 }}>
                <CategoryItem
                  readOnly={false}
                  navigation={navigation}
                  item={item}
                  isRefetching={isRefetching}
                  refetch={refetch}
                />
              </View>
            )}
            onEndReachedThreshold={0.1}
          />
        )}
    </>
  );
};

export default CategoriesScreen;
