import { useEffect } from "react";
import { RootStackScreenProps } from "../../navigators/RootNavigators";
import HeaderRightIcon from "../../components/shared/HeaderRightIcon";
import { ICategory, IProduct } from "../../interfaces";
import ProductForm from "../../components/Products/ProductForm";
import { useAddProduct, useUpdateProduct } from "../../hooks/useProducts";

const AddUpdateCategoryScreen = (
  { navigation, route }: RootStackScreenProps<"AddUpdateProduct">,
) => {
  let category: ICategory = route.params.category;
  let product: IProduct | undefined = route.params
    ? route.params.product
    : undefined;

  const onSuccess = () => navigation.goBack();

  const addProduct = useAddProduct(onSuccess);
  const updateProduct = useUpdateProduct(onSuccess);

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

  const onProductSave = async (prod: IProduct) => {
    if (product) {
      updateProduct(prod);
    } else {
      addProduct(prod);
    }
  };

  return (
    <ProductForm
      onProductSave={onProductSave}
      category={category}
      product={product!}
    />
  );
};

export default AddUpdateCategoryScreen;
