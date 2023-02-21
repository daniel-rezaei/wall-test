import { Product } from "../Repositories/Product"

export enum errors {
  PRODUCT_NOT_EXISTS = 'Product not exists',
}

export enum states {
  IDLE ,
  NONE_IDLE ,
}

interface MachineState {
  id: string
  state : states
  products : Product[]
  coinInsertedAt? : Date | false
  currentBalance: number
  totalSales: number
  hasProduct: (product: Product) => void 
}

export class Machine implements MachineState {
  private _state;
  private _coinInsertedAt : Date | false;
  private _currentBalance;
  private _totalSales;

  constructor(public id: string, public products: Product[]) {
    this._state = states.IDLE;
    this._currentBalance = 0;
    this._totalSales = 0;
    this._coinInsertedAt = false;
  }

  get state(){
    return this._state;
  }
  get totalSales(){
    return this._totalSales;
  }
  get currentBalance(){
    return this._currentBalance;
  }
  get coinInsertedAt(){
    return this._coinInsertedAt;
  }

  set state(value){
    this._state = value;
  }
  set totalSales(value){
    this._totalSales = value;
  }
  set currentBalance(value){
    this._currentBalance = value;
  }
  set coinInsertedAt(value){
    this._coinInsertedAt = value;
  }

  public hasProduct(product: Product){
    if( this.products.filter(p => p.name === product.name).length === 0)
      throw new Error(errors.PRODUCT_NOT_EXISTS);
  }
}
