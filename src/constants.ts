import {
  isVec2,
  isVec3,
  isMat2d,
  isMat4,
  isVec2Object,
  isVec3Object,
} from './utils';

type PropTypes = { [key: string]: any };

export const vec2Obj = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isVec2Object(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a vec2 shape`);
};

export const vec3Obj = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isVec3Object(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a vec3 shape`);
};

export const vec2GlMatrix = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isVec2(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a gl-matrix vec2`);
};

export const vec3GlMatrix = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isVec3(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a gl-matrix vec3`);
};

export const mat2dGlMatrix = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isMat2d(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a gl-matrix mat2d`);
};

export const mat4GlMatrix = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isMat4(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a gl-matrix mat4`);
};
