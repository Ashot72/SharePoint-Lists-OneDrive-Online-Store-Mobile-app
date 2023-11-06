import { baseUrl, lists } from "../constants";
import { getInfo } from "../helper";
import { ICategory, IDriveInfo } from "../interfaces";
import { getSite } from "./commonService";
import { deletePicture, uploadPicture } from "./oneDriveService";
import { getProducts } from "./productService";

export const getCategories = async () => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.category}/items?expand=fields(select=*)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const json = await response.json();

  if (!response.ok) {
    const regNeeded =
      "You may need to add 'Relative Site URL' and click on 'Save'. Please go to the 'Registration' screen from the hamburger menu.";
    throw new Error(json.error.message + " " + regNeeded);
  }

  return json;
};

export const addCategory = async (category: ICategory) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const site = await getSite();
  const oneDrive = await uploadPicture(site.id, category);

  const driveInfo: IDriveInfo = {
    DriveId: oneDrive.parentReference.driveId,
    ItemId: oneDrive.id,
    WebUrl: oneDrive.webUrl,
  };

  category = { ...category, ...driveInfo };
  delete category.ImageUrl;

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.category}/items`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fields: category }),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.message);
  }

  return json;
};

export const updateCategory = async (category: ICategory) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  if (category.ImageUrl) {
    const site = await getSite();
    const oneDrive = await uploadPicture(site.id, category);

    const driveInfo: IDriveInfo = {
      DriveId: oneDrive.parentReference.driveId,
      ItemId: oneDrive.id,
      WebUrl: oneDrive.webUrl,
    };

    category = { ...category, ...driveInfo };
  }

  const id = category.id;

  delete category.id;
  delete category.ImageUrl;

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.category}/items/${id}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fields: category }),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.message);
  }

  return json;
};

export const deleteCategory = async (category: ICategory) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const products = await getProducts(category.id!);

  if (products.value.length > 0) {
    throw new Error(
      "There are products attached to this category. Please delete them first.",
    );
  }

  await deletePicture(category);

  await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.category}/items/${category.id}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};
