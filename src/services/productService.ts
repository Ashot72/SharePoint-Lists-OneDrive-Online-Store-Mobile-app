import { baseUrl, lists } from "../constants";
import { getInfo } from "../helper";
import { ICart, IDriveInfo, IProduct } from "../interfaces";
import { deleteCart, getCartsByProductId } from "./cartService";
import { getSite } from "./commonService";
import { deletePicture, uploadPicture } from "./oneDriveService";
import { getPaymentsByProductId } from "./paymentService";

export const getProducts = async (categoryId: number) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.product}/items?expand=fields(select=*,Category)&filter=fields/CategoryLookupId eq ${categoryId}`,
    {
      headers: {
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

export const getProduct = async (productId: number) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.product}/items?expand=fields(select=*,Category)&filter=fields/ID eq ${productId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
      },
    },
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.message);
  }

  return json;
};

export const addProduct = async (product: IProduct) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const site = await getSite();
  const oneDrive = await uploadPicture(site.id, product);

  const driveInfo: IDriveInfo = {
    DriveId: oneDrive.parentReference.driveId,
    ItemId: oneDrive.id,
    WebUrl: oneDrive.webUrl,
  };

  product = { ...product, ...driveInfo };
  delete product.ImageUrl;

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.product}/items`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fields: product }),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.message);
  }

  return json;
};

export const updateProduct = async (product: IProduct) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  if (product.ImageUrl) {
    const site = await getSite();
    const oneDrive = await uploadPicture(site.id, product);

    const driveInfo: IDriveInfo = {
      DriveId: oneDrive.parentReference.driveId,
      ItemId: oneDrive.id,
      WebUrl: oneDrive.webUrl,
    };

    product = { ...product, ...driveInfo };
  }

  const id = product.id;

  delete product.id;
  delete product.ImageUrl;

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.product}/items/${id}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fields: product }),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.message);
  }

  return json;
};

export const deleteProduct = async (product: IProduct) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const paymentProducts = await getPaymentsByProductId(product.id!);

  if (paymentProducts.value.length === 0) {
    await deletePicture(product);
  }

  await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.product}/items/${product.id}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const cartProducts = await getCartsByProductId(product.id!);

  const cartIds = cartProducts.value.map((cp: any) => cp.fields.id);

  for (let i = 0; i < cartIds.length; i++) {
    await deleteCart({ id: +cartIds[i] } as ICart);
  }
};
