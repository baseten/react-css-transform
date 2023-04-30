import { vec2, vec3, glMatrix, mat2d, mat4 } from 'gl-matrix';
import type { CSSProperties } from 'react';
import type {
  GLMatrixType,
  Vec2Object,
  Vec3Object,
  Vec2SettableProperty,
  Vec3SettableProperty,
  CSSMatrixPrefix,
} from './types';

export const isNil = (val: any) => val === null || val === undefined;

export function isGLMatrixType(
  prop: any,
  length: number,
): prop is GLMatrixType {
  if (prop === null || prop === undefined) {
    return false;
  }

  const usingTypedArray = glMatrix.ARRAY_TYPE === Float32Array;
  const isArray = usingTypedArray
    ? typeof prop === 'object' && prop.byteLength !== undefined
    : Array.isArray(prop);

  return isArray && prop.length === length;
}

export const isVec2 = (prop: unknown): prop is vec2 => isGLMatrixType(prop, 2);
export const isVec3 = (prop: unknown): prop is vec3 => isGLMatrixType(prop, 3);
export const isMat2d = (prop: unknown): prop is mat2d =>
  isGLMatrixType(prop, 6);
export const isMat4 = (prop: unknown): prop is mat4 => isGLMatrixType(prop, 16);

export function isVec2Object(prop: Vec2Object) {
  if (isNil(prop)) {
    return false;
  }

  return prop.x !== undefined || prop.y !== undefined;
}

export function isVec3Object(prop: Vec3Object) {
  if (isNil(prop)) {
    return false;
  }

  return prop.x !== undefined || prop.y !== undefined || prop.z !== undefined;
}

export function setVec2FromProp(
  v: vec2,
  prop: Vec2SettableProperty | undefined,
  defaultValue = 0,
) {
  let x = defaultValue;
  let y = defaultValue;

  if (prop === undefined) {
    return vec2.set(v, x, y);
  }

  if (typeof prop === 'number') {
    x = prop;
    y = prop;
  } else if (typeof prop === 'object') {
    if (isVec2(prop)) {
      return vec2.copy(v, prop);
    }

    x = prop.x !== undefined ? prop.x : defaultValue;
    y = prop.y !== undefined ? prop.y : defaultValue;
  }

  return vec2.set(v, x, y);
}

export function setVec3FromProp(
  v: vec3,
  prop: Vec3SettableProperty | undefined,
  defaultX = 0,
  defaultY = 0,
  defaultZ = 0,
) {
  let x = defaultX;
  let y = defaultY;
  let z = defaultZ;

  if (prop === undefined) {
    return vec3.set(v, x, y, z);
  }

  if (typeof prop === 'number') {
    x = prop;
    y = prop;
    z = prop;
  } else if (typeof prop === 'object') {
    if (isVec3(prop)) {
      return vec3.copy(v, prop);
    }

    x = prop.x !== undefined ? prop.x : defaultX;
    y = prop.y !== undefined ? prop.y : defaultY;
    z = prop.z !== undefined ? prop.z : defaultZ;
  }

  return vec3.set(v, x, y, z);
}

export const getCSSMatrixString = <Matrix extends GLMatrixType>(
  matrixPrefix: CSSMatrixPrefix,
  matrix: Matrix,
): string => {
  return `${matrixPrefix}(${matrix.join(',')})`;
};

export const get2dCSSMatrixString = (matrix: mat2d): string =>
  getCSSMatrixString('matrix', matrix);

export const get3dCSSMatrixString = (matrix: mat4): string =>
  getCSSMatrixString('matrix3d', matrix);

export function merge2dMatrixWithStyles(
  matrix: mat2d,
  styles: CSSProperties,
): CSSProperties {
  return {
    ...styles,
    transform: get2dCSSMatrixString(matrix),
  };
}

export function merge3dMatrixWithStyles(
  matrix: mat4,
  styles: CSSProperties,
): CSSProperties {
  return {
    ...styles,
    transform: get3dCSSMatrixString(matrix),
  };
}
