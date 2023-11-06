import {
  UseMutateFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryKeys } from "../constants";
import { queryClient } from "../queryClient";
import {
  addCart,
  deleteCart,
  deleteCarts,
  getCarts,
  updateCart,
} from "../services/cartService";
import { ICart, ICarts } from "../interfaces";
import { getImage } from "../services/oneDriveService";

export const useCartImage = (cart: ICart) =>
  useQuery({
    queryKey: [queryKeys.carts, cart.id],
    queryFn: async () => await getImage(cart),
  });

export const useCarts = (name: string | undefined) =>
  name
    ? useQuery({
      queryKey: [queryKeys.carts, name],
      queryFn: async () => await getCarts(name) as ICarts,
      enabled: false,
    })
    : { data: null, refetch: () => {}, isRefetching: false, isFetching: false };

export const useAddCart = (
  onSuccess: () => void,
): UseMutateFunction<{ fields: ICart }, unknown, ICart, unknown> => {
  const add = (cart: ICart) => addCart(cart);

  const { mutate } = useMutation(add, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.carts],
      });
      onSuccess();
    },
  });

  return mutate;
};

export const useUpdateCart = (
  onSuccess: () => void,
): UseMutateFunction<{ fields: ICart }, unknown, ICart, unknown> => {
  const update = (cart: ICart) => updateCart(cart);

  const { mutate } = useMutation(
    update,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.carts],
        });
        onSuccess();
      },
    },
  );

  return mutate;
};

export const useDeleteCart = (
  onSuccess: () => void,
): UseMutateFunction<void, unknown, ICart, unknown> => {
  const deleteCrt = (cart: ICart) => deleteCart(cart);

  const { mutate } = useMutation(deleteCrt, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.carts],
      });
      onSuccess();
    },
  });

  return mutate;
};

export const useDeleteCarts = (
  onSuccess: () => void,
): UseMutateFunction<void, unknown, ICart[], unknown> => {
  const deleteCrts = (carts: ICart[]) => deleteCarts(carts);

  const { mutate } = useMutation(deleteCrts, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.carts],
      });
      onSuccess();
    },
  });

  return mutate;
};
