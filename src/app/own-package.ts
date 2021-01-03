export class OwnPackage {
  packageId: string;
  typePackage: number;
  expDate: string;
  amountLimit: number;
  price: number;
  constructor(
    packageId: string,
    type: number,
    exp: string,
    limit: number,
    price: number
  ) {
    this.packageId = packageId;
    this.typePackage = type;
    this.expDate = exp;
    this.amountLimit = limit;
    this.price = price;
  }
}
