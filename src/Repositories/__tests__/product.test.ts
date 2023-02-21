import { productName, productPrice, ProductRepository, totalProductCount } from "../Product";

describe('test product repository', () => { 
  let repository: ProductRepository;
  beforeAll(() => {
    repository = new ProductRepository();
  })
  it('should return all products', () => {
    const products = repository.getAllProducts();
    expect(products.length).toBe(totalProductCount);
  });
  it('should return correct product for tea', () => {
    const teaName = productName.TEA;
    const teaPrice = productPrice.TEA;
    expect(repository.getProductByName(teaName).price).toEqual(teaPrice);
    expect(repository.getProductByName(teaName).name).toEqual(teaName);
  })
 });