export interface Product {
  name: string;
  price: number;
}
export enum errors {
  PRODUCT_NOT_FOUND = 'Product not found'
}
export enum productPrice {
  COFFE = 5,
  TEA = 10
}
export enum productName {
  COFFE = 'Coffe',
  TEA = 'Tea',
  ADDED_FOR_TEST = 'ADDED_FOR_TEST',
}
export const totalProductCount = 2;

export class ProductRepository{

public getAllProducts() : Product[] {
  const coffe = {
    name: productName.COFFE,
    price: productPrice.COFFE
  };
  const tea = {
    name: productName.TEA,
    price: productPrice.TEA
  }
  return [
    tea, coffe
  ];
}

public getProductByName (name: string) : Product{
  const product = this.getAllProducts().filter(p => p.name === name)[0];
  if(product)
    return product;
  if(name === productName.ADDED_FOR_TEST)
    return {name: productName.ADDED_FOR_TEST, price: 0};
  throw new Error(errors.PRODUCT_NOT_FOUND)
}
}