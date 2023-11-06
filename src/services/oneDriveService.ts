import { baseUrl } from "../constants";
import { getInfo, random } from "../helper";
import { ICommon, IDriveInfo } from "../interfaces";

export const getImage = async ({ DriveId, ItemId }: IDriveInfo) => {
  const { accessToken } = await getInfo();

  const responseOneDrive = await fetch(
    `${baseUrl}/drives/${DriveId}/items/${ItemId}/content`,
    {
      headers: {
        "Content-Type": "image/png",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const blob: Blob = await responseOneDrive.blob();
  return blob;
};

export const uploadPicture = async (
  siteId: string,
  { DriveFolder, ImageUrl, WebUrl }: ICommon,
) => {
  const { accessToken } = await getInfo();

  //fetch image from the local device
  const response = await fetch(ImageUrl!);
  const blob: Blob = await response.blob();

  let previousImage = WebUrl
    ? WebUrl.substring(WebUrl.lastIndexOf("/") + 1).replace(".png", "")
    : null;

  //upload image
  const responseOneDrive = await fetch(
    `${baseUrl}/sites/${siteId}/drive/root:/${DriveFolder}/${
      previousImage || random()
    }.png:/content`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "image/png",
        Authorization: `Bearer ${accessToken}`,
      },
      body: blob,
    },
  );

  const json = await responseOneDrive.json();

  if (!responseOneDrive.ok) {
    throw new Error(json.error.message);
  }

  return json;
};

export const deletePicture = async ({ DriveId, ItemId }: IDriveInfo) => {
  const { accessToken } = await getInfo();

  await fetch(`${baseUrl}/drives/${DriveId}/items/${ItemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "image/png",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
