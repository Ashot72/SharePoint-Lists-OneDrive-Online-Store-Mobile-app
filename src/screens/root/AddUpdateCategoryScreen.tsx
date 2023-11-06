import { useEffect } from "react";
import { RootStackScreenProps } from "../../navigators/RootNavigators";
import CategoryForm from "../../components/Categories/CategoryForm";
import HeaderRightIcon from "../../components/shared/HeaderRightIcon";
import { ICategory } from "../../interfaces";
import { useAddCategory, useUpdateCategory } from "../../hooks/useCategories";

const AddUpdateCategoryScreen = (
  { navigation, route }: RootStackScreenProps<"AddUpdateCategory">,
) => {
  let category: ICategory | undefined = route.params
    ? route.params.category
    : undefined;

  const onSuccess = () => navigation.goBack();

  const addCategory = useAddCategory(onSuccess);
  const updateCategory = useUpdateCategory(onSuccess);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        <HeaderRightIcon
          name="close"
          tintColor={tintColor}
          onPress={onSuccess}
        />
      ),
    });
  }, []);

  const onCategorySave = async (cat: ICategory) => {
    if (category) {
      updateCategory(cat);
    } else {
      addCategory(cat);
    }
  };

  return <CategoryForm onCategorySave={onCategorySave} category={category} />;
};

export default AddUpdateCategoryScreen;
