import { baseUrl, lists } from "../constants";
import { getInfo } from "../helper";

export const getUserPicture = async () => {
  const { accessToken } = await getInfo();

  const response = await fetch(`${baseUrl}/me/photo/$value`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const blob: Blob = await response.blob();
  return blob;
};
