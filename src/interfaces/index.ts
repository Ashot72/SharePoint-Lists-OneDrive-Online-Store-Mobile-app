export interface IAuth {
  displayName: string;
  userPrincipalName: string;
  email: string;
}

export interface IUser {
  id?: string;
  Title: string;
  PrincipalName: string;
  Email: string;
}

export interface IDriveInfo {
  DriveId: string;
  ItemId: string;
  WebUrl: string;
}

export interface ICommon extends IDriveInfo {
  id?: number;
  Title: string;
  AspectRatio?: number;
  DriveFolder: string;
  ImageUrl?: string;
}

export interface ICategory extends ICommon {
}

export interface ICategories {
  value: [{
    fields: ICategory;
  }];
}

export interface IProduct extends ICommon {
  id?: number;
  Description: string;
  Count: number;
  Price: number;
  Category: string;
  CategoryLookupId: number;
}

export interface IProducts {
  value: [{
    fields: IProduct;
  }];
}

export interface ICart extends ICommon {
  Qty: number;
  Product: string;
  ProductPrice: number;
  ProductCount: number;
  ProductAspectRatio: number;
  ProductPriceLookupId: number;
  ProductCountLookupId: number;
  ProductAspectRatioLookupId: number;
  ProductLookupId: number;
  CategoryLookupId: number;
  PrincipalName: string;
}

export interface ICarts {
  value: [{
    fields: ICart;
  }] | [];
}

export interface IPayment extends ICommon {
  OrderId: number;
  Qty: number;
  Price: number;
  ProductId: number;
  PrincipalName: string;
}

export interface IPayments {
  value: [{
    fields: IPayment;
    createdDateTime: string;
  }] | [];
}

export interface IRequest {
  id: number;
  headers: { "Content-Type": string };
  body?: { fields: {} };
  method: string;
  url: string;
}
