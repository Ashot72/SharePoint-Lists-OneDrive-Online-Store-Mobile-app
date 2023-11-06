import { baseUrl, lists } from "../constants";
import { getInfo } from "../helper";
import { ICart, IRequest } from "../interfaces";

export const getCarts = async (principalName: string) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.cart}/items?expand=fields(select=*,ProductPrice,ProductCount,Product,ProductAspectRatio,Category)&filter=fields/PrincipalName eq '${principalName}'`,
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

export const getCartsByProductId = async (productId: number) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.cart}/items?expand=fields(select=*,ProductPrice,ProductCount,Product,ProductAspectRatio,Category)&filter=fields/ProductLookupId eq ${productId}`,
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

export const addCart = async (cart: ICart) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const userCarts = await getCarts(cart.PrincipalName);
  const userCart = userCarts.value.find((c: any) =>
    c.fields.ProductLookupId === cart.id
  );

  if (userCart) {
    const qty = userCart.fields.Qty + cart.Qty;

    return await updateCart({ id: userCart.fields.id, Qty: qty } as ICart);
  } else {
    delete cart.id;

    const response = await fetch(
      `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.cart}/items`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ fields: cart }),
      },
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error.message);
    }

    return json;
  }
};

export const updateCart = async (cart: ICart) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.cart}/items/${cart.id}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fields: { Qty: cart.Qty } }),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.message);
  }

  return json;
};

export const deleteCart = async (cart: ICart) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.cart}/items/${cart.id}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteCarts = async (carts: ICart[]) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const requests: IRequest[] = [];

  carts.forEach((cart: ICart, index: number) => {
    requests.push({
      id: index + 1,
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      url:
        `/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.cart}/items/${cart.id}`,
    });
  });

  await fetch("https://graph.microsoft.com/v1.0/$batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ requests }),
  });
};
