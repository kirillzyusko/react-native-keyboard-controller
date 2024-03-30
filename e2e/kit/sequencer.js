const Sequencer = require("@jest/test-sequencer").default;

/**
 * We run tests in alphabetical order because we arranged them from fastest to slowest
 * and on CI it will give us an ability to run tests on a "warm" simulator (which should
 * give less random crashes in the end).
 */
class CustomSequencer extends Sequencer {
  sort = (tests) => {
    // Test structure information
    // https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
    const copyTests = Array.from(tests);

    // sort in alphabetical order
    return copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
  };
}

module.exports = CustomSequencer;
