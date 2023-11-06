import { baseUrl } from "../constants";
import { getInfo } from "../helper";
import { lists } from "../constants";

const create = async (list: any) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(list),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.message);
  }

  return json;
};

const categoryList = ({
  displayName: lists.category,
  columns: [
    {
      name: "AspectRatio",
      number: {},
    },
    {
      name: "DriveFolder",
      indexed: true,
      enforceUniqueValues: true,
      text: {},
    },
    {
      name: "DriveId",
      text: {},
    },
    {
      name: "ItemId",
      text: {},
    },
    {
      name: "WebUrl",
      text: {
        "allowMultipleLines": true,
      },
    },
  ],
  list: {
    template: "genericList",
  },
});

const productList = (categoryListId: string) => ({
  displayName: lists.product,
  columns: [
    {
      name: "AspectRatio",
      number: {},
    },
    {
      name: "DriveFolder",
      text: {},
    },
    {
      name: "DriveId",
      text: {},
    },
    {
      name: "ItemId",
      text: {},
    },
    {
      name: "WebUrl",
      text: {
        "allowMultipleLines": true,
      },
    },
    {
      name: "Description",
      text: {
        "allowMultipleLines": true,
      },
    },
    {
      name: "Count",
      number: {},
    },
    {
      name: "Price",
      number: {},
    },
    {
      name: "Category",
      indexed: true,
      lookup: {
        columnName: "Title",
        listId: categoryListId,
      },
    },
  ],
  list: {
    template: "genericList",
  },
});

const cardList = (categoryListId: string, productListId: string) => ({
  displayName: lists.cart,
  columns: [
    {
      name: "PrincipalName",
      indexed: true,
      text: {},
    },
    {
      name: "DriveFolder",
      text: {},
    },
    {
      name: "Qty",
      number: {},
    },
    {
      name: "DriveId",
      text: {},
    },
    {
      name: "ItemId",
      text: {},
    },
    {
      name: "WebUrl",
      text: {
        "allowMultipleLines": true,
      },
    },
    {
      name: "Category",
      lookup: {
        columnName: "Title",
        listId: categoryListId,
      },
    },
    {
      name: "ProductCount",
      lookup: {
        columnName: "Count",
        listId: productListId,
      },
    },
    {
      name: "ProductPrice",
      lookup: {
        columnName: "Price",
        listId: productListId,
      },
    },
    {
      name: "ProductAspectRatio",
      lookup: {
        columnName: "AspectRatio",
        listId: productListId,
      },
    },
    {
      name: "Product",
      lookup: {
        columnName: "Title",
        listId: productListId,
      },
    },
  ],
  list: {
    template: "genericList",
  },
});

const paymentList = () => ({
  displayName: lists.payment,
  columns: [
    {
      name: "AspectRatio",
      number: {},
    },
    {
      name: "PrincipalName",
      indexed: true,
      text: {},
    },
    {
      name: "OrderId",
      number: {},
    },
    {
      name: "DriveFolder",
      text: {},
    },
    {
      name: "Qty",
      number: {},
    },
    {
      name: "Price",
      number: {},
    },
    {
      name: "DriveId",
      text: {},
    },
    {
      name: "ItemId",
      text: {},
    },
    {
      name: "ProductId",
      indexed: true,
      number: {},
    },
    {
      name: "WebUrl",
      text: {
        "allowMultipleLines": true,
      },
    },
  ],
  list: {
    template: "genericList",
  },
});

export const createLists = async (): Promise<void> =>
  new Promise(async (resolve, reject) => {
    let categoryListId: string;
    let productListId: string;

    create(categoryList)
      .then((json) => {
        categoryListId = json.id;
        return create(productList(categoryListId));
      })
      .then((json) => {
        productListId = json.id;
        return create(cardList(categoryListId, productListId));
      })
      .then(() => create(paymentList()))
      .then(() => resolve())
      .catch((e) =>
        e.message === "Name already exists" ? resolve() : reject(e)
      );
  });
