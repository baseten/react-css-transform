import { render } from '@testing-library/react';
import { mat2d, vec2 } from 'gl-matrix';
import Transform2d, {
  apply2dTransforms,
  Transform2dProps,
} from '../src/Transform2d';
import { MultiplicationOrder } from '../src/types';
import { extractCSS2DMatrix } from './utils';

describe('<Transform2d />', () => {
  const getVectorsAndMatrices = () => {
    const identity = mat2d.create();
    const parentMatrixWorld = mat2d.translate(
      identity,
      identity,
      vec2.fromValues(-10, -10),
    );
    const matrix = mat2d.create();
    const matrixWorld = mat2d.create();
    const vTranslation = vec2.create();
    const vScale = vec2.create();

    return {
      parentMatrixWorld,
      matrix,
      matrixWorld,
      vTranslation,
      vScale,
    };
  };

  const getTransformPropsAsObjects = () => {
    return {
      translate: {
        x: 10,
        y: 20,
      },
      scale: 2,
      rotate: Math.PI / 2,
    };
  };

  const getTransformPropsAsGlMatrixInstances = () => {
    return {
      translate: vec2.fromValues(10, 20),
      scale: vec2.fromValues(2, 2),
      rotate: Math.PI / 2,
    };
  };

  const getProps = (overrides: Partial<Transform2dProps> = {}) => {
    return {
      multiplicationOrder: 'POST' as MultiplicationOrder,
      ...getTransformPropsAsObjects(),
      ...overrides,
    };
  };

  describe('missing or incorrect props', () => {
    it('sets the vTranslation vec2 correctly when no prop is passed', () => {
      const matrices = getVectorsAndMatrices();
      const props = getProps({
        translate: undefined,
      });

      apply2dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.vTranslation).toMatchVector([0, 0]);
    });

    it('sets the vScale vec2 correctly when no prop is passed', () => {
      const matrices = getVectorsAndMatrices();
      const props = getProps({
        scale: undefined,
      });

      apply2dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.vScale).toMatchVector([1, 1]);
    });

    it('sets rotate to 0 when it is passed incorrectly', () => {
      const matrices = getVectorsAndMatrices();
      const props = getProps({
        // @ts-ignore - deliberately testing bad prop
        rotate: true,
      });

      apply2dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.matrix).toMatchMatrix([2, 0, 0, 2, 10, 20]);
      expect(matrices.matrixWorld).toMatchMatrix([2, 0, 0, 2, 0, 10]);
    });

    it('renders null when no children passed through', () => {
      const props = getProps();

      // @ts-ignore - deliberately testing no children
      const { container } = render(<Transform2d {...props} />);

      expect(container.children).toHaveLength(0);
    });

    it.each`
      description                                 | willRender | expectedCount
      ${'correctly renders truthy boolean logic'} | ${true}    | ${2}
      ${'correctly renders falsy boolean logic'}  | ${false}   | ${1}
    `('$description', ({ willRender, expectedCount }) => {
      const props = getProps();

      const { container } = render(
        <Transform2d {...props}>
          <div />
          {willRender && <div />}
        </Transform2d>,
      );

      expect(container.children).toHaveLength(expectedCount);
    });
  });

  describe.each`
    description                   | transformProps
    ${'props as JS objects'}      | ${getTransformPropsAsObjects()}
    ${'props as gl-matrix vec2s'} | ${getTransformPropsAsGlMatrixInstances()}
  `('$description', ({ transformProps }) => {
    it('performs the correct matrix calculations', () => {
      const matrices = getVectorsAndMatrices();
      const props = getProps(transformProps);

      apply2dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.matrix).toMatchMatrix([0, 2, -2, 0, 10, 20]);
      expect(matrices.matrixWorld).toMatchMatrix([0, 2, -2, 0, 0, 10]);
    });

    it('performs the correct calculations when passed PRE as the multiplication order', () => {
      const matrices = getVectorsAndMatrices();
      const props = getProps({
        ...transformProps,
        multiplicationOrder: 'PRE',
      });

      apply2dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.matrix).toMatchMatrix([0, 2, -2, 0, 10, 20]);
      expect(matrices.matrixWorld).toMatchMatrix([0, 2, -2, 0, 30, 0]);
    });

    it('passes the correct attributes down to an HTML element', () => {
      const props = getProps(transformProps);
      const { container } = render(
        <Transform2d {...props}>
          <div className="child" style={{ background: '#f00' }} />
        </Transform2d>,
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const child = container.querySelector('.child')!;

      expect(child).not.toHaveAttribute('parentMatrixWorld');
      expect(child).not.toHaveAttribute('multiplicationOrder');
      expect(child).toHaveAttribute(
        'style',
        expect.stringMatching(
          /background: rgb\(255, 0, 0\); transform: matrix\(.*\);/,
        ),
      );

      const cssMatrix = extractCSS2DMatrix(child);

      expect(cssMatrix).toMatchMatrix([0, 2, -2, 0, 10, 20]);
    });

    it('passes the correct props down to a React Component', () => {
      const props = getProps();
      const Comp: jest.Mocked<() => JSX.Element> = jest.fn(() => <div />);

      render(
        <Transform2d {...props}>
          <Comp />
        </Transform2d>,
      );

      expect(Comp).toHaveBeenCalledWith(
        {
          parentMatrixWorld: expect.matrixMatching([0, 2, -2, 0, 10, 20]),
          multiplicationOrder: 'POST',
          style: {
            transform: expect.stringContaining('matrix('),
          },
        },
        {},
      );
    });

    it('passes the correct props down to multiple React Components', () => {
      const props = getProps();
      const Comp: jest.Mocked<() => JSX.Element> = jest.fn(() => <div />);

      render(
        <Transform2d {...props}>
          <Comp />
          <Comp />
        </Transform2d>,
      );

      expect(Comp).toHaveBeenNthCalledWith(
        1,
        {
          parentMatrixWorld: expect.matrixMatching([0, 2, -2, 0, 10, 20]),
          multiplicationOrder: 'POST',
          style: {
            transform: expect.stringContaining('matrix('),
          },
        },
        {},
      );
      expect(Comp).toHaveBeenNthCalledWith(
        2,
        {
          parentMatrixWorld: expect.matrixMatching([0, 2, -2, 0, 10, 20]),
          multiplicationOrder: 'POST',
          style: {
            transform: expect.stringContaining('matrix('),
          },
        },
        {},
      );
    });

    it('passes the correct props down to a function as a child', () => {
      const props = getProps();
      const comp = jest.fn(() => <div />);

      render(<Transform2d {...props}>{comp}</Transform2d>);

      expect(comp).toHaveBeenCalledWith({
        parentMatrixWorld: expect.matrixMatching([0, 2, -2, 0, 10, 20]),
        multiplicationOrder: 'POST',
        style: {
          transform: expect.stringContaining('matrix('),
        },
      });
    });
  });
});
