import {
  UseMutateFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryKeys } from "../constants";
import { ICategories, ICategory } from "../interfaces";
import { queryClient } from "../queryClient";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";
import { getImage } from "../services/oneDriveService";

export const useCategoryImage = (category: ICategory) =>
  useQuery({
    queryKey: [queryKeys.categories, category.id],
    queryFn: async () => await getImage(category),
  });

export const useCategories = () =>
  useQuery({
    queryKey: [queryKeys.categories],
    queryFn: async () => await getCategories() as ICategories,
    enabled: false,
  });

export const useAddCategory = (
  onSuccess: () => void,
): UseMutateFunction<{ fields: ICategory }, unknown, ICategory, unknown> => {
  const add = (category: ICategory) => addCategory(category);

  const { mutate } = useMutation(add, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.categories],
      });
      onSuccess();
    },
  });

  return mutate;
};

export const useUpdateCategory = (
  onSuccess: () => void,
): UseMutateFunction<{ fields: ICategory }, unknown, ICategory, unknown> => {
  const update = (category: ICategory) => updateCategory(category);

  const { mutate } = useMutation(update, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.categories],
      });
      onSuccess();
    },
  });

  return mutate;
};

export const useDeleteCategory = (
  onSuccess: () => void,
): UseMutateFunction<void, unknown, ICategory, unknown> => {
  const deleteCat = (category: ICategory) => deleteCategory(category);

  const { mutate } = useMutation(deleteCat, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.categories],
      });
      onSuccess();
    },
  });

  return mutate;
};
