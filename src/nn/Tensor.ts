/**
 * Tensor - Multi-dimensional array with gradient tracking
 * Inspired by PyTorch tensors for learnable parameter support
 */
export class Tensor {
  data: number[];
  shape: number[];
  requiresGrad: boolean;
  grad?: Tensor;

  constructor(data: number[], shape: number[], requiresGrad: boolean = false) {
    this.data = data;
    this.shape = shape;
    this.requiresGrad = requiresGrad;
  }

  static zeros(shape: number[], requiresGrad: boolean = false): Tensor {
    const size = shape.reduce((a, b) => a * b, 1);
    return new Tensor(new Array(size).fill(0), shape, requiresGrad);
  }

  static ones(shape: number[], requiresGrad: boolean = false): Tensor {
    const size = shape.reduce((a, b) => a * b, 1);
    return new Tensor(new Array(size).fill(1), shape, requiresGrad);
  }

  static randn(shape: number[], requiresGrad: boolean = false): Tensor {
    const size = shape.reduce((a, b) => a * b, 1);
    const data = new Array(size).fill(0).map(() => {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    });
    return new Tensor(data, shape, requiresGrad);
  }

  static uniform(shape: number[], min: number = 0, max: number = 1, requiresGrad: boolean = false): Tensor {
    const size = shape.reduce((a, b) => a * b, 1);
    const data = new Array(size).fill(0).map(() => min + Math.random() * (max - min));
    return new Tensor(data, shape, requiresGrad);
  }

  get size(): number {
    return this.data.length;
  }

  get(indices: number[]): number {
    let idx = 0;
    let multiplier = 1;
    for (let i = this.shape.length - 1; i >= 0; i--) {
      idx += indices[i] * multiplier;
      multiplier *= this.shape[i];
    }
    return this.data[idx];
  }

  set(indices: number[], value: number): void {
    let idx = 0;
    let multiplier = 1;
    for (let i = this.shape.length - 1; i >= 0; i--) {
      idx += indices[i] * multiplier;
      multiplier *= this.shape[i];
    }
    this.data[idx] = value;
  }

  clone(): Tensor {
    return new Tensor([...this.data], [...this.shape], this.requiresGrad);
  }

  reshape(newShape: number[]): Tensor {
    const newSize = newShape.reduce((a, b) => a * b, 1);
    if (newSize !== this.size) {
      throw new Error(`Cannot reshape tensor of size ${this.size} to shape ${newShape}`);
    }
    return new Tensor([...this.data], newShape, this.requiresGrad);
  }

  add(other: Tensor): Tensor {
    if (this.size !== other.size) {
      throw new Error('Tensor sizes must match for addition');
    }
    const result = this.data.map((val, idx) => val + other.data[idx]);
    return new Tensor(result, [...this.shape], this.requiresGrad || other.requiresGrad);
  }

  mul(scalar: number): Tensor {
    const result = this.data.map(val => val * scalar);
    return new Tensor(result, [...this.shape], this.requiresGrad);
  }

  matmul(other: Tensor): Tensor {
    // Simple matrix multiplication for 2D tensors
    if (this.shape.length !== 2 || other.shape.length !== 2) {
      throw new Error('matmul only supports 2D tensors');
    }
    if (this.shape[1] !== other.shape[0]) {
      throw new Error('Incompatible shapes for matrix multiplication');
    }

    const m = this.shape[0];
    const n = this.shape[1];
    const p = other.shape[1];
    const result = new Array(m * p).fill(0);

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += this.get([i, k]) * other.get([k, j]);
        }
        result[i * p + j] = sum;
      }
    }

    return new Tensor(result, [m, p], this.requiresGrad || other.requiresGrad);
  }

  sum(): number {
    return this.data.reduce((a, b) => a + b, 0);
  }

  mean(): number {
    return this.sum() / this.size;
  }

  toArray(): number[] {
    return [...this.data];
  }
}
