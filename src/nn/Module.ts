import { Tensor } from './Tensor';

/**
 * Base Module class - inspired by torch.nn.Module
 * All neural network components inherit from this
 */
export abstract class Module {
  protected parameters: Map<string, Tensor>;
  protected modules: Map<string, Module>;
  protected _training: boolean;

  constructor() {
    this.parameters = new Map();
    this.modules = new Map();
    this._training = true;
  }

  abstract forward(input: Tensor): Tensor;

  /**
   * Call method to make module callable like a function
   */
  call(input: Tensor): Tensor {
    return this.forward(input);
  }

  /**
   * Register a parameter tensor
   */
  registerParameter(name: string, tensor: Tensor): void {
    this.parameters.set(name, tensor);
  }

  /**
   * Register a sub-module
   */
  registerModule(name: string, module: Module): void {
    this.modules.set(name, module);
  }

  /**
   * Get all parameters including sub-modules
   */
  getAllParameters(): Tensor[] {
    const params: Tensor[] = [];
    
    // Add own parameters
    this.parameters.forEach(param => params.push(param));
    
    // Add sub-module parameters
    this.modules.forEach(module => {
      params.push(...module.getAllParameters());
    });
    
    return params;
  }

  /**
   * Set training mode
   */
  train(mode: boolean = true): this {
    this._training = mode;
    this.modules.forEach(module => module.train(mode));
    return this;
  }

  /**
   * Set evaluation mode
   */
  eval(): this {
    return this.train(false);
  }

  get training(): boolean {
    return this._training;
  }

  /**
   * Zero out all gradients
   */
  zeroGrad(): void {
    this.parameters.forEach(param => {
      if (param.requiresGrad) {
        param.grad = Tensor.zeros(param.shape);
      }
    });
    this.modules.forEach(module => module.zeroGrad());
  }
}
