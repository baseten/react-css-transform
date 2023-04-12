import '@testing-library/jest-dom';
import CustomMatcherResult = jest.CustomMatcherResult;
import MatcherContext = jest.MatcherContext;

const isExpand = (expand?: boolean): boolean => expand !== false;

// Annoying ripped logic from expect, since jest team don't want to expose
// existing matchers:
// https://github.com/facebook/jest/issues/10329
// https://github.com/facebook/jest/issues/2547
const toBeCloseTo = (received: number, expected: number, precision = 2) => {
  if (typeof expected !== 'number') {
    throw new Error('expected value must be a number');
  }

  if (typeof received !== 'number') {
    throw new Error('received value must be a number');
  }

  let pass = false;
  let expectedDiff = 0;
  let receivedDiff = 0;

  if (received === Infinity && expected === Infinity) {
    pass = true; // Infinity - Infinity is NaN
  } else if (received === -Infinity && expected === -Infinity) {
    pass = true; // -Infinity - -Infinity is NaN
  } else {
    // eslint-disable-next-line no-restricted-properties, prefer-exponentiation-operator
    expectedDiff = Math.pow(10, -precision) / 2;
    receivedDiff = Math.abs(expected - received);
    pass = receivedDiff < expectedDiff;
  }

  return {
    expectedDiff,
    receivedDiff,
    pass,
  };
};

type MatrixDataType = 'Matrix' | 'Vector';

const makeMatrixMatcher = (scope: MatcherContext, dataType: MatrixDataType) => {
  return (
    actualMatrix: number[] | Float32Array,
    expectedMatrixArray: number[],
    precision = 6,
  ): CustomMatcherResult => {
    const matcherName = `toMatch${dataType}`;
    const { isNot, promise, utils, expand } = scope;
    const options = {
      isNot,
      promise,
    };
    const received = Array.from(actualMatrix);
    const expected = expectedMatrixArray;

    const {
      matcherHint,
      printExpected,
      printReceived,
      printDiffOrStringify,
      stringify,
    } = utils;

    if (received.length !== expected.length) {
      return {
        message: () =>
          // eslint-disable-next-line prefer-template
          matcherHint(matcherName, undefined, undefined, options) +
          '\n\n' +
          `Expected: ${printExpected(expected)}\n` +
          `Received: ${printReceived(received)}\n` +
          '\n' +
          `${dataType} lengths do not match, expected has ${expected.length}, received has ${received.length}`,
        pass: false,
      };
    }

    const results = received.map((item, index) =>
      toBeCloseTo(item, expectedMatrixArray[index], precision),
    );
    const pass = results.reduce((acc, result) => acc && result.pass, true);
    const indices = results.reduce((acc, result, index) => {
      return result.pass ? acc : acc.concat(index);
    }, [] as number[]);

    const message = pass
      ? () =>
          // eslint-disable-next-line prefer-template
          matcherHint(matcherName, undefined, undefined, options) +
          '\n\n' +
          `Expected: not ${printExpected(expected)}\n` +
          (stringify(expected) !== stringify(received)
            ? `Received:     ${printReceived(received)}`
            : '')
      : () =>
          // eslint-disable-next-line prefer-template
          matcherHint(matcherName, undefined, undefined, options) +
          '\n\n' +
          `${indices.length > 1 ? 'Indices' : 'Index'} ${indices} ${
            indices.length > 1 ? 'do' : 'does'
          } not match with precision ${precision}` +
          '\n\n' +
          // TODO: this isn't perfect because it doesn't take precision into account, so can report too many errors
          printDiffOrStringify(
            expected,
            received,
            'Expected',
            'Received',
            isExpand(expand),
          );

    return {
      message,
      pass,
    };
  };
};

expect.extend({
  // symmetric naming
  toMatchVector(
    actualVector: unknown,
    expectedVectorArray: number[],
    precision = 6,
  ) {
    return makeMatrixMatcher(this, 'Vector')(
      actualVector as number[] | Float32Array,
      expectedVectorArray,
      precision,
    );
  },

  toMatchMatrix(
    actualMatrix: unknown,
    expectedMatrixArray: number[],
    precision = 6,
  ) {
    return makeMatrixMatcher(this, 'Matrix')(
      actualMatrix as number[] | Float32Array,
      expectedMatrixArray,
      precision,
    );
  },

  // asymmetric naming
  vectorMatching(
    actualVector: unknown,
    expectedVectorArray: number[],
    precision = 6,
  ) {
    return makeMatrixMatcher(this, 'Vector')(
      actualVector as number[] | Float32Array,
      expectedVectorArray,
      precision,
    );
  },

  matrixMatching(
    actualMatrix: unknown,
    expectedMatrixArray: number[],
    precision = 6,
  ) {
    return makeMatrixMatcher(this, 'Matrix')(
      actualMatrix as number[] | Float32Array,
      expectedMatrixArray,
      precision,
    );
  },
});
