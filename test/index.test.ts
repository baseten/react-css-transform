import * as index from '../src/index';

describe('index', () => {
  test('export modules for react-css-transform', () => {
    expect(index).toMatchSnapshot();
  });
});
