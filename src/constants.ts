export const redirect_uri = "http://localhost:3000";
export const scope =
  "User.ReadBasic.All User.Read.All User.ReadWrite.All Mail.Read offline_access Files.ReadWrite.All";

export const baseUrl: string = "https://graph.microsoft.com/v1.0";

export const queryKeys = {
  user: "user",
  categories: "categories",
  products: "products",
  carts: "carts",
  payments: "payments",
  listGeneration: "listGeneration",
};

export const lists = {
  user: "User",
  category: "Category",
  product: "Product",
  cart: "Cart",
  payment: "Payment",
};
