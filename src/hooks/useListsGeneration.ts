import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { queryKeys } from "../constants";
import { queryClient } from "../queryClient";
import { createLists } from "../services/listsGenerationService";

export const useCreateLists = (
  onSuccess: () => void,
): UseMutateFunction<void, unknown, void, unknown> => {
  const create = () => createLists();

  const { mutate } = useMutation(create, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listGeneration],
      });
      onSuccess();
    },
  });

  return mutate;
};
