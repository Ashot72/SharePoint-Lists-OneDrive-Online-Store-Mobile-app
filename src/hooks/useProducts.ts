import {
  UseMutateFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryKeys } from "../constants";
import { IProduct, IProducts } from "../interfaces";
import { queryClient } from "../queryClient";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../services/productService";
import { getImage } from "../services/oneDriveService";

export const useProductImage = (product: IProduct) =>
  useQuery({
    queryKey: [queryKeys.products, "product-image" + product.id],
    queryFn: async () => await getImage(product),
  });

export const useProducts = (categoryId: number) =>
  useQuery({
    queryKey: [queryKeys.products, categoryId],
    queryFn: async () => await getProducts(categoryId) as IProducts,
  });

export const useProduct = (productId: number) =>
  useQuery({
    queryKey: [queryKeys.products, "product" + productId],
    queryFn: async () => await getProduct(productId),
    enabled: false,
  });

export const useAddProduct = (
  onSuccess: () => void,
): UseMutateFunction<{ fields: IProduct }, unknown, IProduct, unknown> => {
  const add = (product: IProduct) => addProduct(product);

  const { mutate } = useMutation(add, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products],
      });
      onSuccess();
    },
  });

  return mutate;
};

export const useUpdateProduct = (
  onSuccess: () => void,
): UseMutateFunction<{ fields: IProduct }, unknown, IProduct, unknown> => {
  const update = (product: IProduct) => updateProduct(product);

  const { mutate } = useMutation(update, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products],
      });
      onSuccess();
    },
  });

  return mutate;
};

export const useDeleteProduct = (
  onSuccess: () => void,
): UseMutateFunction<void, unknown, IProduct, unknown> => {
  const deleteProd = (product: IProduct) => deleteProduct(product);

  const { mutate } = useMutation(deleteProd, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products],
      });
      onSuccess();
    },
  });

  return mutate;
};
