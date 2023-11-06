import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth, AzureInstance } from "../lib";
import { redirect_uri, scope } from "./constants";

export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

export const random = () => Math.floor(100000 + Math.random() * 900000);

const minutesDiff = (tokenTimestamp: number, currentTimestamp: number) => {
  let differenceValue = (tokenTimestamp - currentTimestamp) / 1000;
  differenceValue /= 60;
  return Math.round(differenceValue);
};

export const getAccessToken = async () => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    const tokenParserd = JSON.parse(token);
    const accessToken = tokenParserd.accessToken;

    const currentTime = new Date().getTime();
    const expiresTime = `${tokenParserd.expires_in}000`;

    const diffInMinutes = minutesDiff(+expiresTime, currentTime);

    //get new access token from refresh token
    if (diffInMinutes < 1) {
      const client_id = process.env.EXPO_PUBLIC_CLIENT_ID;
      const client_secret = process.env.EXPO_PUBLIC_CLIENT_SECRET;

      const credentials = { client_id, client_secret, redirect_uri, scope };
      const azureInstance = new AzureInstance(credentials);

      const auth = new Auth(azureInstance);
      const refreshToken = tokenParserd.refreshToken;

      const newToken = await auth.getTokenFromRefreshToken(refreshToken);

      await AsyncStorage.setItem("token", JSON.stringify(newToken));
      return newToken.accessToken;
    } else {
      return accessToken;
    }
  } else {
    return null;
  }
};

export const getInfo = async () => {
  const accessToken = await getAccessToken();

  const url = await AsyncStorage.getItem("url");
  const relativeUrl = await AsyncStorage.getItem("relativeUrl");

  const sharePointHost = url?.replace("https://", "").split(".")[0] +
    ".sharepoint.com";
  return { accessToken, sharePointHost, relativeUrl };
};
