import {
  UseMutateFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryKeys } from "../constants";
import { IPayment, IPayments } from "../interfaces";
import { queryClient } from "../queryClient";
import { getImage } from "../services/oneDriveService";
import { addPayment, getPayments } from "../services/paymentService";

export const usePaymentImage = (payment: IPayment) =>
  useQuery({
    queryKey: [queryKeys.payments, "payment-image" + payment.id],
    queryFn: async () => await getImage(payment),
  });

export const usePayments = (name: string) =>
  name
    ? useQuery({
      queryKey: [queryKeys.payments, name],
      queryFn: async () => await getPayments(name) as IPayments,
      enabled: false,
    })
    : { data: null, refetch: () => {}, isRefetching: false, isFetching: false };

export const useAddPayment = (
  onSuccess: () => void,
): UseMutateFunction<IPayment[], unknown, IPayment[], unknown> => {
  const add = (payments: IPayment[]) => addPayment(payments);

  const { mutate } = useMutation(add, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.payments],
      });
      onSuccess();
    },
  });

  return mutate;
};
