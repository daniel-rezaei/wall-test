import {v4 as uuid} from 'uuid';
import { Machine } from '../Models/Machine';
import { ProductRepository } from '../Repositories/Product';

export const generateFakeMachines = (count: number) : Machine[] => {
  let out : Machine[] = [];
  const productRepo = new ProductRepository();
  while(count-- > 0){
    out.push(new Machine(uuid(), productRepo.getAllProducts()));
  }
  return out;
}
