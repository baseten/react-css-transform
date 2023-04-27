import { MatcherFunction } from 'expect';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Expect {
      toMatchVector(expected: number[], precision?: number): number[];
      toMatchMatrix(expected: number[], precision?: number): number[];
      vectorMatching(expected: number[], precision?: number): number[];
      matrixMatching(expected: number[], precision?: number): number[];
    }
    interface ExpectExtendMap {
      toMatchVector: MatcherFunction<[expected: number[], precision?: number]>;
      toMatchMatrix: MatcherFunction<[expected: number[], precision?: number]>;
      vectorMatching: MatcherFunction<[expected: number[], precision?: number]>;
      matrixMatching: MatcherFunction<[expected: number[], precision?: number]>;
    }
  }
}
