import {
  isNil,
  isVec2,
  isVec3,
  isMat2d,
  isMat4,
  isVec2Object,
  isVec3Object,
} from './utils';

type PropTypes = { [key: string]: any };
interface PropTypeValidator {
  <P extends PropTypes>(
    props: P,
    propName: string & keyof P,
    componentName: string,
  ): null | Error;
}
interface PropTypeWithRequired extends PropTypeValidator {
  isRequired: PropTypeValidator;
}

function createPropType<P extends PropTypes>(
  validator: PropTypeValidator,
  isRequired: boolean,
) {
  return (props: P, propName: string & keyof P, componentName: string) => {
    const prop = props[propName];

    if (isNil(prop)) {
      if (isRequired) {
        return new Error(
          `${propName} is required in ${componentName} but received ${prop}`,
        );
      }
      return null;
    }

    return validator(props, propName, componentName);
  };
}

const vec2ObjValidator = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isVec2Object(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a vec2 shape`);
};

export const vec2Obj: PropTypeWithRequired = createPropType(
  vec2ObjValidator,
  false,
) as PropTypeWithRequired;
vec2Obj.isRequired = createPropType(vec2ObjValidator, true);

const vec3ObjValidator = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isVec3Object(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a vec3 shape`);
};

export const vec3Obj: PropTypeWithRequired = createPropType(
  vec3ObjValidator,
  false,
) as PropTypeWithRequired;
vec3Obj.isRequired = createPropType(vec3ObjValidator, true);

const vec2GlMatrixValidator = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isVec2(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a gl-matrix vec2`);
};

export const vec2GlMatrix: PropTypeWithRequired = createPropType(
  vec2GlMatrixValidator,
  false,
) as PropTypeWithRequired;
vec2GlMatrix.isRequired = createPropType(vec2GlMatrixValidator, true);

const vec3GlMatrixValidator = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isVec3(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a gl-matrix vec3`);
};
export const vec3GlMatrix: PropTypeWithRequired = createPropType(
  vec3GlMatrixValidator,
  false,
) as PropTypeWithRequired;
vec3GlMatrix.isRequired = createPropType(vec3GlMatrixValidator, true);

const mat2dGlMatrixValidator = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isMat2d(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a gl-matrix mat2d`);
};

export const mat2dGlMatrix: PropTypeWithRequired = createPropType(
  mat2dGlMatrixValidator,
  false,
) as PropTypeWithRequired;
mat2dGlMatrix.isRequired = createPropType(mat2dGlMatrixValidator, true);

export const mat4GlMatrixValidator = <P extends PropTypes>(
  props: P,
  propName: string & keyof P,
  componentName: string,
) => {
  const passes = isMat4(props[propName]);
  return passes
    ? null
    : new Error(`${propName} in ${componentName} is not a gl-matrix mat4`);
};

export const mat4GlMatrix: PropTypeWithRequired = createPropType(
  mat4GlMatrixValidator,
  false,
) as PropTypeWithRequired;
mat4GlMatrix.isRequired = createPropType(mat4GlMatrixValidator, true);
