/**
 * Simple tests for neural network components
 */

import { Tensor, Linear, Embedding, LayerNorm } from '../index';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function testTensor() {
  console.log('Testing Tensor...');
  
  const t1 = Tensor.zeros([2, 3]);
  assert(t1.size === 6, 'zeros size');
  
  const t2 = Tensor.ones([2, 3]);
  assert(t2.size === 6, 'ones size');
  
  const t3 = t1.add(t2);
  assert(t3.data.every(x => x === 1), 'add operation');
  
  console.log('✓ Tensor tests passed');
}

function testLinear() {
  console.log('Testing Linear layer...');
  
  const layer = new Linear(10, 5);
  const input = Tensor.randn([3, 10]);
  const output = layer.forward(input);
  
  assert(output.shape[0] === 3, 'batch size preserved');
  assert(output.shape[1] === 5, 'output features correct');
  
  console.log('✓ Linear layer tests passed');
}

function testEmbedding() {
  console.log('Testing Embedding layer...');
  
  const embed = new Embedding(100, 16);
  const indices = new Tensor([1, 5, 10], [3]);
  const output = embed.forward(indices);
  
  assert(output.shape[0] === 3, 'batch size correct');
  assert(output.shape[1] === 16, 'embedding dim correct');
  
  console.log('✓ Embedding layer tests passed');
}

console.log('Running Neural Network Tests...\n');
testTensor();
testLinear();
testEmbedding();
console.log('\n✓ All tests passed!');
