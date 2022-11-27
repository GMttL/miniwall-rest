const TestSequencer = require('@jest/test-sequencer').default;
const path = require('path');

class CustomSequencer extends TestSequencer {
    sort(tests) {
      // Test structure information
      // https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
      return Array.from(tests).sort((testA, testB) => (testA.path < testB.path ? 1 : -1));
    }
  }

module.exports = CustomSequencer;