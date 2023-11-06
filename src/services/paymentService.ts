import { baseUrl, lists } from "../constants";
import { getInfo } from "../helper";
import { IPayment, IRequest } from "../interfaces";

export const getPayments = async (principalName: string) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();
  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.payment}/items?expand=fields(select=*)&filter=fields/PrincipalName eq '${principalName}'&orderby=fields/ID desc`,
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

export const getPaymentsByProductId = async (productId: number) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();
  const response = await fetch(
    `${baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.payment}/items?expand=fields(select=*)&filter=fields/ProductId eq ${productId}`,
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

export const addPayment = async (payments: IPayment[]) => {
  const { accessToken, sharePointHost, relativeUrl } = await getInfo();

  const requests: IRequest[] = [];

  payments.forEach((payment: IPayment, index: number) => {
    requests.push({
      id: index + 1,
      headers: {
        "Content-Type": "application/json",
      },
      body: { fields: payment },
      method: "POST",
      url:
        `/sites/${sharePointHost}:${relativeUrl}:/lists/${lists.payment}/items`,
    });
  });

  const response = await fetch("https://graph.microsoft.com/v1.0/$batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ requests }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.message);
  }

  return json;
};
