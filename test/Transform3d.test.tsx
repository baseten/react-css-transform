import { render } from '@testing-library/react';
import { mat4, vec3 } from 'gl-matrix';
import Transform3d, {
  apply3dTransforms,
  Transform3dProps,
} from '../src/Transform3d';
import { MultiplicationOrder } from '../src/types';
import { extractCSS3DMatrix } from './utils';

describe('<Transform3d />', () => {
  const getVectorsAndMatrices = (overrides = {}) => {
    const identity = mat4.create();
    const parentMatrixWorld = mat4.translate(
      identity,
      identity,
      vec3.fromValues(-10, -10, -10),
    );
    const matrix = mat4.create();
    const matrixWorld = mat4.create();
    const vTranslation = vec3.create();
    const vScale = vec3.create();
    const vRotationAxis = vec3.create();

    return {
      parentMatrixWorld,
      matrix,
      matrixWorld,
      vTranslation,
      vScale,
      vRotationAxis,
      ...overrides,
    };
  };

  const getTransformPropsAsObjects = () => {
    return {
      translate: {
        x: 10,
        y: 20,
        z: 30,
      },
      scale: 2,
      rotate: Math.PI / 2,
      rotateAxis: {
        x: 0,
        y: 1,
        z: 0,
      },
    };
  };

  const getTransformPropsAsGlMatrixInstances = () => {
    return {
      translate: vec3.fromValues(10, 20, 30),
      scale: vec3.fromValues(2, 2, 2),
      rotate: Math.PI / 2,
      rotateAxis: vec3.fromValues(0, 1, 0),
    };
  };

  const getProps = (overrides: Partial<Transform3dProps> = {}) => {
    return {
      multiplicationOrder: 'POST' as MultiplicationOrder,
      ...getTransformPropsAsObjects(),
      ...overrides,
    };
  };

  describe('missing or incorrect props', () => {
    it('sets the vTranslation vec3 correctly when no prop is passed', () => {
      const matrices = getVectorsAndMatrices();
      const props = getProps({
        translate: undefined,
      });

      apply3dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.vTranslation).toMatchVector([0, 0, 0]);
    });

    it('sets the vScale vec3 correctly when no prop is passed', () => {
      const matrices = getVectorsAndMatrices();
      const props = getProps({
        scale: undefined,
      });

      apply3dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.vScale).toMatchVector([1, 1, 1]);
    });

    it('sets the vRotationAxis vec3 correctly when no prop is passed', () => {
      const matrices = getVectorsAndMatrices();
      const props = getProps({
        rotateAxis: undefined,
      });

      apply3dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.vRotationAxis).toMatchVector([0, 0, 1]);
    });

    it('sets rotate to 0 when it is passed incorrectly', () => {
      const matrices = getVectorsAndMatrices();
      const props = getProps({
        // @ts-ignore - deliberately testing bad prop
        rotate: true,
      });

      apply3dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.matrix).toMatchMatrix([
        2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 10, 20, 30, 1,
      ]);
      expect(matrices.matrixWorld).toMatchMatrix([
        2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 10, 20, 1,
      ]);
    });

    it('renders null when no children passed through', () => {
      const props = getProps();

      // @ts-ignore - deliberately testing no children
      const { container } = render(<Transform3d {...props} />);

      expect(container.children).toHaveLength(0);
    });

    it.each`
      description                                 | willRender | expectedCount
      ${'correctly renders truthy boolean logic'} | ${true}    | ${2}
      ${'correctly renders falsy boolean logic'}  | ${false}   | ${1}
    `('$description', ({ willRender, expectedCount }) => {
      const props = getProps();

      const { container } = render(
        <Transform3d {...props}>
          <div />
          {willRender && <div />}
        </Transform3d>,
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

      apply3dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.matrix).toMatchMatrix([
        0, 0, -2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 10, 20, 30, 1,
      ]);
      expect(matrices.matrixWorld).toMatchMatrix([
        0, 0, -2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 10, 20, 1,
      ]);
    });

    it('performs the correct calculations when passed PRE as the multiplication order', () => {
      const matrices = getVectorsAndMatrices();
      const props = getProps({
        ...transformProps,
        multiplicationOrder: 'PRE',
      });

      apply3dTransforms({
        ...matrices,
        ...props,
      });

      expect(matrices.matrix).toMatchMatrix([
        0, 0, -2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 10, 20, 30, 1,
      ]);
      expect(matrices.matrixWorld).toMatchMatrix([
        0, 0, -2, 0, 0, 2, 0, 0, 2, 0, 0, 0, -10, 0, 50, 1,
      ]);
    });

    it('passes the correct attributes down to an HTML element', () => {
      const props = getProps(transformProps);
      const { container } = render(
        <Transform3d {...props}>
          <div className="child" style={{ background: '#f00' }} />
        </Transform3d>,
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const child = container.querySelector('.child')!;

      expect(child).not.toHaveAttribute('parentMatrixWorld');
      expect(child).not.toHaveAttribute('multiplicationOrder');
      expect(child).toHaveAttribute(
        'style',
        expect.stringMatching(
          /background: rgb\(255, 0, 0\); transform: matrix3d\(.*\);/,
        ),
      );

      const cssMatrix = extractCSS3DMatrix(child);

      expect(cssMatrix).toMatchMatrix([
        0, 0, -2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 10, 20, 30, 1,
      ]);
    });

    it('passes the correct props down to a React Component', () => {
      const props = getProps();
      const Comp: jest.Mocked<() => JSX.Element> = jest.fn(() => <div />);

      render(
        <Transform3d {...props}>
          <Comp />
        </Transform3d>,
      );

      expect(Comp).toHaveBeenCalledWith(
        {
          parentMatrixWorld: expect.matrixMatching([
            0, 0, -2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 10, 20, 30, 1,
          ]),
          multiplicationOrder: 'POST',
          style: {
            transform: expect.stringContaining('matrix3d('),
          },
        },
        {},
      );
    });

    it('passes the correct props down to multiple React Components', () => {
      const props = getProps();
      const Comp: jest.Mocked<() => JSX.Element> = jest.fn(() => <div />);

      render(
        <Transform3d {...props}>
          <Comp />
          <Comp />
        </Transform3d>,
      );

      expect(Comp).toHaveBeenNthCalledWith(
        1,
        {
          parentMatrixWorld: expect.matrixMatching([
            0, 0, -2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 10, 20, 30, 1,
          ]),
          multiplicationOrder: 'POST',
          style: {
            transform: expect.stringContaining('matrix3d('),
          },
        },
        {},
      );
      expect(Comp).toHaveBeenNthCalledWith(
        2,
        {
          parentMatrixWorld: expect.matrixMatching([
            0, 0, -2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 10, 20, 30, 1,
          ]),
          multiplicationOrder: 'POST',
          style: {
            transform: expect.stringContaining('matrix3d('),
          },
        },
        {},
      );
    });

    it('passes the correct props down to a function as a child', () => {
      const props = getProps();
      const comp = jest.fn(() => <div />);

      render(<Transform3d {...props}>{comp}</Transform3d>);

      expect(comp).toHaveBeenCalledWith({
        parentMatrixWorld: expect.matrixMatching([
          0, 0, -2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 10, 20, 30, 1,
        ]),
        multiplicationOrder: 'POST',
        style: {
          transform: expect.stringContaining('matrix3d('),
        },
      });
    });
  });

  describe('behaves like Transform2d when passed only 2d arguments', () => {
    const get2dParentMatrixWorld = () => {
      const identity = mat4.create();
      return mat4.translate(identity, identity, vec3.fromValues(-10, -10, 0));
    };

    const get2dProps = (overrides = {}) => {
      return getProps({
        translate: {
          x: 10,
          y: 20,
        },
        scale: {
          x: 2,
          y: 2,
        },
        rotate: Math.PI / 2,
        rotateAxis: undefined,
        ...overrides,
      });
    };

    it('performs the correct matrix calculations', () => {
      const matrices = getVectorsAndMatrices({
        parentMatrixWorld: get2dParentMatrixWorld(),
      });
      const props = get2dProps();

      apply3dTransforms({
        ...matrices,
        ...props,
      });

      // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
      // matrix(a, b, c, d, tx, ty) is a shorthand for matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1).
      expect(matrices.matrix).toMatchMatrix([
        0, 2, 0, 0, -2, 0, 0, 0, 0, 0, 1, 0, 10, 20, 0, 1,
      ]);
      expect(matrices.matrixWorld).toMatchMatrix([
        0, 2, 0, 0, -2, 0, 0, 0, 0, 0, 1, 0, 0, 10, 0, 1,
      ]);
    });

    it('performs the correct calculations when passed PRE as the multiplication order', () => {
      const matrices = getVectorsAndMatrices({
        parentMatrixWorld: get2dParentMatrixWorld(),
      });
      const props = get2dProps({
        multiplicationOrder: 'PRE',
      });

      apply3dTransforms({
        ...matrices,
        ...props,
      });

      // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
      // matrix(a, b, c, d, tx, ty) is a shorthand for matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1).
      expect(matrices.matrix).toMatchMatrix([
        0, 2, 0, 0, -2, 0, 0, 0, 0, 0, 1, 0, 10, 20, 0, 1,
      ]);
      expect(matrices.matrixWorld).toMatchMatrix([
        0, 2, 0, 0, -2, 0, 0, 0, 0, 0, 1, 0, 30, 0, 0, 1,
      ]);
    });
  });
});
