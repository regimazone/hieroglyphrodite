import { Module } from './Module';
import { Tensor } from './Tensor';

/**
 * Linear (fully-connected) layer
 * Implements: y = xW^T + b
 */
export class Linear extends Module {
  private weight: Tensor;
  private bias: Tensor | null;
  private inFeatures: number;
  private outFeatures: number;

  constructor(inFeatures: number, outFeatures: number, useBias: boolean = true) {
    super();
    this.inFeatures = inFeatures;
    this.outFeatures = outFeatures;

    // Initialize weights using Xavier/Glorot initialization
    const limit = Math.sqrt(6 / (inFeatures + outFeatures));
    this.weight = Tensor.uniform(
      [outFeatures, inFeatures],
      -limit,
      limit,
      true
    );
    this.registerParameter('weight', this.weight);

    if (useBias) {
      this.bias = Tensor.zeros([outFeatures], true);
      this.registerParameter('bias', this.bias);
    } else {
      this.bias = null;
    }
  }

  forward(input: Tensor): Tensor {
    // input: [batchSize, inFeatures] or [inFeatures]
    const isBatched = input.shape.length === 2;
    
    if (!isBatched && input.shape[0] !== this.inFeatures) {
      throw new Error(`Input size mismatch: expected ${this.inFeatures}, got ${input.shape[0]}`);
    }

    // Reshape input to 2D if needed
    const x = isBatched ? input : input.reshape([1, this.inFeatures]);
    
    // Matrix multiplication
    const output = x.matmul(this.weight.reshape([this.inFeatures, this.outFeatures]));

    // Add bias if present
    const result = this.bias ? output.add(this.bias) : output;

    // Reshape back if input was 1D
    return isBatched ? result : result.reshape([this.outFeatures]);
  }
}

/**
 * Embedding layer - maps discrete indices to continuous vectors
 * Essential for learnable feature representations
 */
export class Embedding extends Module {
  private weight: Tensor;
  private numEmbeddings: number;
  private embeddingDim: number;

  constructor(numEmbeddings: number, embeddingDim: number) {
    super();
    this.numEmbeddings = numEmbeddings;
    this.embeddingDim = embeddingDim;

    // Initialize embeddings with random values
    this.weight = Tensor.randn([numEmbeddings, embeddingDim], true);
    this.registerParameter('weight', this.weight);
  }

  forward(indices: Tensor): Tensor {
    // indices: [batchSize] or single value
    const batchSize = indices.size;
    const result = new Array(batchSize * this.embeddingDim).fill(0);

    for (let i = 0; i < batchSize; i++) {
      const idx = Math.floor(indices.data[i]);
      if (idx < 0 || idx >= this.numEmbeddings) {
        throw new Error(`Index ${idx} out of range [0, ${this.numEmbeddings})`);
      }

      for (let j = 0; j < this.embeddingDim; j++) {
        result[i * this.embeddingDim + j] = this.weight.get([idx, j]);
      }
    }

    return new Tensor(result, [batchSize, this.embeddingDim], true);
  }

  /**
   * Get embedding for a single index
   */
  getEmbedding(index: number): number[] {
    if (index < 0 || index >= this.numEmbeddings) {
      throw new Error(`Index ${index} out of range [0, ${this.numEmbeddings})`);
    }

    const embedding = new Array(this.embeddingDim);
    for (let i = 0; i < this.embeddingDim; i++) {
      embedding[i] = this.weight.get([index, i]);
    }
    return embedding;
  }

  /**
   * Update embedding for a specific index
   */
  updateEmbedding(index: number, values: number[]): void {
    if (values.length !== this.embeddingDim) {
      throw new Error(`Expected ${this.embeddingDim} values, got ${values.length}`);
    }

    for (let i = 0; i < this.embeddingDim; i++) {
      this.weight.set([index, i], values[i]);
    }
  }
}

/**
 * Activation functions
 */
export class ReLU extends Module {
  forward(input: Tensor): Tensor {
    const data = input.data.map(x => Math.max(0, x));
    return new Tensor(data, input.shape, input.requiresGrad);
  }
}

export class Sigmoid extends Module {
  forward(input: Tensor): Tensor {
    const data = input.data.map(x => 1 / (1 + Math.exp(-x)));
    return new Tensor(data, input.shape, input.requiresGrad);
  }
}

export class Tanh extends Module {
  forward(input: Tensor): Tensor {
    const data = input.data.map(x => Math.tanh(x));
    return new Tensor(data, input.shape, input.requiresGrad);
  }
}

export class Softmax extends Module {
  private dim: number;

  constructor(dim: number = -1) {
    super();
    this.dim = dim;
  }

  forward(input: Tensor): Tensor {
    // Simple 1D softmax for now
    const max = Math.max(...input.data);
    const exp = input.data.map(x => Math.exp(x - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    const data = exp.map(x => x / sum);
    return new Tensor(data, input.shape, input.requiresGrad);
  }
}

/**
 * Dropout layer for regularization
 */
export class Dropout extends Module {
  private p: number;

  constructor(p: number = 0.5) {
    super();
    this.p = p;
  }

  forward(input: Tensor): Tensor {
    if (!this.training) {
      return input;
    }

    const scale = 1 / (1 - this.p);
    const data = input.data.map(x => {
      return Math.random() > this.p ? x * scale : 0;
    });

    return new Tensor(data, input.shape, input.requiresGrad);
  }
}

/**
 * LayerNorm for stable training
 */
export class LayerNorm extends Module {
  private normalizedShape: number[];
  private eps: number;
  private weight: Tensor;
  private bias: Tensor;

  constructor(normalizedShape: number[], eps: number = 1e-5) {
    super();
    this.normalizedShape = Array.isArray(normalizedShape) ? normalizedShape : [normalizedShape];
    this.eps = eps;

    const size = this.normalizedShape.reduce((a, b) => a * b, 1);
    this.weight = Tensor.ones([size], true);
    this.bias = Tensor.zeros([size], true);

    this.registerParameter('weight', this.weight);
    this.registerParameter('bias', this.bias);
  }

  forward(input: Tensor): Tensor {
    const mean = input.mean();
    const variance = input.data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / input.size;
    const std = Math.sqrt(variance + this.eps);

    const normalized = input.data.map((x, i) => {
      const norm = (x - mean) / std;
      return norm * this.weight.data[i % this.weight.size] + this.bias.data[i % this.bias.size];
    });

    return new Tensor(normalized, input.shape, input.requiresGrad);
  }
}
