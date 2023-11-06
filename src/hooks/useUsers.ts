import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { queryKeys } from "../constants";
import { IAuth } from "../interfaces";
import { getUserPicture } from "../services/userService";

export const useUser = () => {
  const [user, setUser] = useState<IAuth>();

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("auth");
      const tokenParsed: IAuth = JSON.parse(token!);
      setUser(tokenParsed);
    })();
  }, []);

  return user;
};

export const useGetPicture = () =>
  useQuery({
    queryKey: [queryKeys.user],
    queryFn: async () => await getUserPicture(),
  });

export const useIsSignedIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      setIsSignedIn(token ? true : false);
    })();
  });

  return isSignedIn;
};
