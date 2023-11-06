import { baseUrl } from "../constants";
import { getInfo } from "../helper";

export const getSite = async () => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:/${relativeUrl}`,
    {
      headers: {
        "Content-Type": "image/png",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.message);
  }

  return json;
};
