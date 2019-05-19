import { vec2, vec3, glMatrix } from 'gl-matrix';

export function isGlMatrixType(prop, length) {
  if (prop === null || prop === undefined) {
    return false;
  }

  const usingTypedArray = glMatrix.ARRAY_TYPE === Float32Array;
  const isArray = usingTypedArray ? typeof prop === 'object' && prop.byteLength !== undefined : Array.isArray(prop);

  return isArray && prop.length === length;
}

export const isVec2 = prop => isGlMatrixType(prop, 2);
export const isVec3 = prop => isGlMatrixType(prop, 3);
export const isMat2d = prop => isGlMatrixType(prop, 6);
export const isMat4 = prop => isGlMatrixType(prop, 16);

export function isVec2Shape(prop) {
  if (prop === null || prop === undefined) {
    return false;
  }

  const allowedKeys = ['x', 'y'];

  return !!Object.keys(prop).filter(key => allowedKeys.includes(key)).length;
}

export function isVec3Shape(prop) {
  if (prop === null || prop === undefined) {
    return false;
  }

  const allowedKeys = ['x', 'y', 'z'];

  return !!Object.keys(prop).filter(key => allowedKeys.includes(key)).length;
}

export function setVec2FromProp(v, prop, defaultValue = 0) {
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

export function setVec3FromProp(v, prop, defaultX = 0, defaultY = 0, defaultZ = 0) {
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
