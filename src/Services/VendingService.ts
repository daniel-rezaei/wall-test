import { Machine } from '../Models/Machine';
import { ProductRepository } from '../Repositories/Product';
import {states} from '../Models/Machine';

export enum errors {
  MACHINE_NOT_FOUND = 'Machine not found',
  NOT_SUFFICIENT_FUND = 'Not sufficient fund',
  DUPLICATE_REQUEST = 'Duplicate request'
}

export class VendingService {
  private state: Machine[];
  private dispenseRequests: string[];
  private productRepository: ProductRepository;
  private TIMEOUT = process.env.NODE_ENV === 'test' ? 1 : 15*60*1000;
  constructor(initialState: Machine[]){
    this.state = initialState;
    //it would be much better to inject ProductRepository, both for testing purposes and maintenance in future
    this.productRepository = new ProductRepository();
    this.dispenseRequests = [];
  }

  public coinInserted(machineId: string, coinValue: number): boolean{
    let machine = this.isMachinExists(machineId);
    if(machine.state !== states.IDLE)
      return false;
    machine.state = states.NONE_IDLE;
    machine.coinInsertedAt = new Date();
    machine.currentBalance += coinValue;
    machine.totalSales += coinValue;
    this.updateState(machine);
    return true;
  }

  public dispense(machineId: string, productName: string, requestId: string): boolean {
    
    this.checkForDuplicateRequestId(requestId);
      
    let machine = this.isMachinExists(machineId);
    if(machine.state !== states.NONE_IDLE)
    return false;
    
    const product = this.productRepository.getProductByName(productName);
    machine.hasProduct(product);
    if(product.price > machine.currentBalance)
      throw new Error(errors.NOT_SUFFICIENT_FUND)

    machine.state = states.IDLE;
    machine.coinInsertedAt = false;
    machine.currentBalance -= product.price; //Or we should set balance to zero?!
    this.updateState(machine);
    return true;
  }
  private isMachinExists(machineId: string): Machine{
    let machine = this.state.filter(m => m.id === machineId)[0];
    if(!machine)
      throw new Error(errors.MACHINE_NOT_FOUND)
    return machine;
  }

  private checkForDuplicateRequestId(requestId: string): void{
    if(this.dispenseRequests.includes(requestId))
      throw new Error(errors.DUPLICATE_REQUEST);
    this.dispenseRequests.push(requestId);
  }

  private updateState(newMachine: Machine){
    this.state = this.state.map(m => (m.id === newMachine.id ? newMachine : m));
  }

  public resetTimedoutMachines(){
    const now = (new Date()).getTime();
    this.state = this.state.map(machine => {
      if(machine.coinInsertedAt && now - machine.coinInsertedAt.getTime() > this.TIMEOUT){
        machine.state = states.IDLE;
        machine.currentBalance = 0;
        machine.coinInsertedAt = false;
      }
      return machine;
    })
  }

  public getState(): Machine[] {
    return this.state.slice();
  }
}