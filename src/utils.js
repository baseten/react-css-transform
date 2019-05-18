import { vec2, vec3, glMatrix } from 'gl-matrix';

export function setVec2FromProp(v, prop, defaultValue = 0) {
  let x = defaultValue;
  let y = defaultValue;

  if (!prop) {
    return vec2.set(v, x, y);
  }

  if (typeof prop === 'number') {
    x = prop;
    y = prop;
  } else {
    const usingTypedArray = glMatrix.ARRAY_TYPE === Float32Array;
    const isArray = usingTypedArray ? prop.byteLength !== undefined : Array.isArray(prop);

    if (isArray) {
      [x, y] = prop;
    } else if (typeof prop === 'object') {
      x = prop.x || defaultValue;
      y = prop.y || defaultValue;
    }
  }

  return vec2.set(v, x, y);
}

export function setVec3FromProp(v, prop, defaultX = 0, defaultY = 0, defaultZ = 0) {
  let x = defaultX;
  let y = defaultY;
  let z = defaultZ;

  if (!prop) {
    return vec3.set(v, x, y, z);
  }

  if (typeof prop === 'number') {
    x = prop;
    y = prop;
    z = prop;
  } else {
    const usingTypedArray = glMatrix.ARRAY_TYPE === Float32Array;
    const isArray = usingTypedArray ? prop.byteLength !== undefined : Array.isArray(prop);

    if (isArray) {
      [x, y, z] = prop;
    } else if (typeof prop === 'object') {
      x = prop.x || defaultX;
      y = prop.y || defaultY;
      z = prop.z || defaultZ;
    }
  }

  return vec3.set(v, x, y, z);
}
