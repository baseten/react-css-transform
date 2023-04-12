import PropTypes from 'prop-types';
import { mat2d, vec2 } from 'gl-matrix';

import { vec2Obj, vec2GlMatrix, mat2dGlMatrix } from './constants';
import { setVec2FromProp } from './utils';
import { useFactoryRef } from './useFactoryRef';
import { useRender } from './useRender';
import type {
  MultiplicationOrder,
  TransformChildren,
  Vec2Object,
} from './types';

const propTypes = {
  parentMatrixWorld: mat2dGlMatrix,
  multiplicationOrder: PropTypes.oneOf(['PRE', 'POST']).isRequired,
  translate: PropTypes.oneOfType([vec2GlMatrix, vec2Obj]),
  scale: PropTypes.oneOfType([vec2GlMatrix, vec2Obj, PropTypes.number]),
  rotate: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export type Transform2dProps = {
  children: TransformChildren<mat2d>;
  parentMatrixWorld?: mat2d;
  multiplicationOrder?: MultiplicationOrder;
  translate?: vec2 | Vec2Object;
  scale?: vec2 | Vec2Object | number;
  rotate?: number;
};

export type Apply2dTransformsParams = {
  parentMatrixWorld: mat2d;
  matrix: mat2d;
  matrixWorld: mat2d;
  vTranslation: vec2;
  vScale: vec2;
  multiplicationOrder: MultiplicationOrder;
  translate?: vec2 | Vec2Object;
  scale?: vec2 | Vec2Object | number;
  rotate?: number;
};

// TODO: somehow implement safe memoization with some sort of equality check?
// considering mutable objects
export function apply2dTransforms({
  parentMatrixWorld,
  matrix,
  matrixWorld,
  vTranslation,
  vScale,
  multiplicationOrder,
  translate,
  scale,
  rotate,
}: Apply2dTransformsParams) {
  const theta = typeof rotate === 'number' ? rotate : 0;

  mat2d.identity(matrix);

  setVec2FromProp(vTranslation, translate);
  setVec2FromProp(vScale, scale, 1);

  // T * R * S
  mat2d.translate(matrix, matrix, vTranslation);
  mat2d.rotate(matrix, matrix, theta);
  mat2d.scale(matrix, matrix, vScale);

  if (multiplicationOrder === 'PRE') {
    mat2d.multiply(matrixWorld, matrix, parentMatrixWorld);
  } else {
    mat2d.multiply(matrixWorld, parentMatrixWorld, matrix);
  }
}

const Transform2d = ({
  children,
  parentMatrixWorld,
  translate,
  scale,
  rotate,
  multiplicationOrder = 'POST',
}: Transform2dProps) => {
  const safeParentMatrixWorld = useFactoryRef<mat2d>(
    () => parentMatrixWorld || mat2d.create(),
  );
  const matrix = useFactoryRef<mat2d>(() => mat2d.create());
  const matrixWorld = useFactoryRef<mat2d>(() => mat2d.create());
  const vTranslation = useFactoryRef<vec2>(() => vec2.create());
  const vScale = useFactoryRef<vec2>(() => vec2.create());

  apply2dTransforms({
    parentMatrixWorld: safeParentMatrixWorld.current,
    matrix: matrix.current,
    matrixWorld: matrixWorld.current,
    vTranslation: vTranslation.current,
    vScale: vScale.current,
    multiplicationOrder,
    translate,
    scale,
    rotate,
  });

  const render = useRender<mat2d>({
    cssMatrixPrefix: 'matrix',
    matrixWorld,
    multiplicationOrder,
  });

  return render(children);
};

Transform2d.propTypes = propTypes;

export default Transform2d;
