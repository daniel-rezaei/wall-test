import { states, errors as machineErrors } from "../../Models/Machine";
import { productName, errors as productErrors } from "../../Repositories/Product";
import { generateFakeMachines } from "../../Utility";
import { errors, VendingService } from "../VendingService"

describe("testing vending service",() => {
  let service: VendingService;
  beforeEach(() => {
    service = new VendingService(generateFakeMachines(5));
  })
  it('should update machine state correctly', () => {
    const machine = service.getState()[0];
    const res = service.coinInserted(machine.id, 1);
    const new_machine = service.getState()[0];
    expect(res).toBe(true);
    expect(new_machine.state).toBe(states.NONE_IDLE);
  })
  it('should do nothing on changing non-idle machine state', () => {
    const machine = service.getState()[0];
    service.coinInserted(machine.id, 1);
    const new_machine = service.getState()[0];
    const none = service.coinInserted(machine.id, 1);
    expect(new_machine.state).toBe(states.NONE_IDLE);
    expect(none).toBe(false);
  })
  it('should throw error on accessing invalid machine - coinInserted', () => {
    expect(() => service.coinInserted('NOT_VALID_ID', 0)).toThrowError(errors.MACHINE_NOT_FOUND);
  })
  it('should dispense correctly', () => {
    const machine = service.getState()[0];
    service.coinInserted(machine.id, 100);
    const result = service.dispense(machine.id, productName.COFFE, 'RANDOM');
    const new_machine = service.getState()[0];
    expect(result).toBe(true);
    expect(new_machine.state).toBe(states.IDLE);
  })
  it('should throw error on accessing invalid machine - dispence', () => {
    expect(() => service.dispense('NOT_VALID_ID', productName.COFFE, 'RANDOM')).toThrowError(errors.MACHINE_NOT_FOUND);
  })
  it('should should return false for dispence request on idle machines', () => {
    const machine = service.getState()[0];
    const result = service.dispense(machine.id, productName.COFFE, 'RANDOM');
    expect(result).toBe(false);
  })
  it('should throw error on insufficient fund', () => {
    const machine = service.getState()[0];
    service.coinInserted(machine.id, 1);
    expect(() => service.dispense(machine.id, productName.COFFE, 'RANDOM')).toThrowError(errors.NOT_SUFFICIENT_FUND);
  })
  it('should throw error on duplicate requestId', () => {
    const machine = service.getState()[0];
    service.coinInserted(machine.id, 100);
    service.dispense(machine.id, productName.COFFE, 'DUPLICATE');
    expect(() => service.dispense(machine.id, productName.COFFE, 'DUPLICATE')).toThrowError(errors.DUPLICATE_REQUEST);
  })
  it('should throw error on invalid product name', () => {
    const machine = service.getState()[0];
    service.coinInserted(machine.id, 1);
    expect(() => service.dispense(machine.id, 'INVALID_NAME', 'RANDOM')).toThrowError(productErrors.PRODUCT_NOT_FOUND);
  })
  it('should throw error on NONE product name', () => {
    const machine = service.getState()[0];
    service.coinInserted(machine.id, 1);
    expect(() => service.dispense(machine.id, productName.ADDED_FOR_TEST, 'RANDOM')).toThrowError(machineErrors.PRODUCT_NOT_EXISTS);
  })
  it('should clear machine states after timeout', async () => {
    const machine = service.getState()[0];
    service.coinInserted(machine.id, 1);
    await new Promise((resolve, reject) => setTimeout(resolve, 2));
    service.resetTimedoutMachines();
    const new_machine = service.getState()[0];
    expect(new_machine.state).toBe(states.IDLE);
  })
})