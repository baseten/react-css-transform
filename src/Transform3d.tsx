import PropTypes from 'prop-types';
import { mat4, vec3 } from 'gl-matrix';

import { vec3Obj, vec3GlMatrix, mat4GlMatrix } from './constants';
import { setVec3FromProp } from './utils';
import { useFactoryRef } from './useFactoryRef';
import { useRender } from './useRender';
import type {
  MultiplicationOrder,
  TransformChildren,
  Vec3Object,
} from './types';

const propTypes = {
  parentMatrixWorld: mat4GlMatrix,
  multiplicationOrder: PropTypes.oneOf(['PRE', 'POST']).isRequired,
  translate: PropTypes.oneOfType([vec3GlMatrix, vec3Obj]),
  scale: PropTypes.oneOfType([vec3GlMatrix, vec3Obj, PropTypes.number]),
  rotate: PropTypes.number,
  rotateAxis: PropTypes.oneOfType([vec3GlMatrix, vec3Obj]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export type Transform3dProps = {
  children: TransformChildren<mat4>;
  parentMatrixWorld?: mat4;
  multiplicationOrder?: MultiplicationOrder;
  translate?: vec3 | Vec3Object;
  scale?: vec3 | Vec3Object | number;
  rotate?: number;
  rotateAxis?: vec3 | Vec3Object;
};

export type Apply3dTransformsParams = {
  parentMatrixWorld: mat4;
  matrix: mat4;
  matrixWorld: mat4;
  vTranslation: vec3;
  vScale: vec3;
  vRotationAxis: vec3;
  multiplicationOrder: MultiplicationOrder;
  translate?: vec3 | Vec3Object;
  scale?: vec3 | Vec3Object | number;
  rotate?: number;
  rotateAxis?: vec3 | Vec3Object;
};

// TODO: somehow implement safe memoization with some sort of equality check?
// considering mutable objects
export function apply3dTransforms({
  parentMatrixWorld,
  matrix,
  matrixWorld,
  vTranslation,
  vScale,
  vRotationAxis,
  multiplicationOrder,
  translate,
  scale,
  rotate,
  rotateAxis,
}: Apply3dTransformsParams) {
  const theta = typeof rotate === 'number' ? rotate : 0;

  mat4.identity(matrix);

  setVec3FromProp(vTranslation, translate);
  setVec3FromProp(vScale, scale, 1, 1, 1);
  setVec3FromProp(vRotationAxis, rotateAxis, 0, 0, 1);

  // T * R * S
  mat4.translate(matrix, matrix, vTranslation);
  mat4.rotate(matrix, matrix, theta, vRotationAxis);
  mat4.scale(matrix, matrix, vScale);

  if (multiplicationOrder === 'PRE') {
    mat4.multiply(matrixWorld, matrix, parentMatrixWorld);
  } else {
    mat4.multiply(matrixWorld, parentMatrixWorld, matrix);
  }
}

const Transform3d = ({
  children,
  parentMatrixWorld,
  translate,
  scale,
  rotate,
  rotateAxis,
  multiplicationOrder = 'POST',
}: Transform3dProps) => {
  const safeParentMatrixWorld = useFactoryRef<mat4>(
    () => parentMatrixWorld || mat4.create(),
  );
  const matrix = useFactoryRef<mat4>(() => mat4.create());
  const matrixWorld = useFactoryRef<mat4>(() => mat4.create());
  const vTranslation = useFactoryRef<vec3>(() => vec3.create());
  const vScale = useFactoryRef<vec3>(() => vec3.create());
  const vRotationAxis = useFactoryRef<vec3>(() => vec3.create());

  apply3dTransforms({
    parentMatrixWorld: safeParentMatrixWorld.current,
    matrix: matrix.current,
    matrixWorld: matrixWorld.current,
    vTranslation: vTranslation.current,
    vScale: vScale.current,
    vRotationAxis: vRotationAxis.current,
    multiplicationOrder,
    translate,
    scale,
    rotate,
    rotateAxis,
  });

  const render = useRender<mat4>({
    cssMatrixPrefix: 'matrix3d',
    matrixWorld,
    multiplicationOrder,
  });

  return render(children);
};

Transform3d.propTypes = propTypes;

export default Transform3d;
