import { isVec2, isVec3, isMat2d, isMat4, isVec2Shape, isVec3Shape } from './utils';

export const MULTIPLICATION_ORDER = {
  /**
   * This is the default, more natural mathematically and (arguably) more useful, it behaves in the same order as when
   * applying multiple transforms on the css `transform` property:
   *
   * <Transform2d translate={{x:100, y:100}} multiplicationOrder={Transform2d.MULTIPLICATION_ORDER.POST}>
   *   <Transform2d rotate={0.7854}>
   *     <Transform2d scale={2}>
   *       <div></div>
   *     </Transform2d>
   *   </Transform>
   * </Transform2d>
   *
   * Is the same as applying a style of `transform: translate(100px,100px) rotate(0.7845rad) scale(2)` to the inner div
   */
  POST: 'POST',
  /**
   * This mimics how CSS transforms work between nested DOM elements
   *
   * <Transform2d translate={{x:100, y:100}} multiplicationOrder={Transform2d.MULTIPLICATION_ORDER.PRE}>
   *   <Transform2d rotate={0.7854}>
   *     <Transform2d scale={2}>
   *       <div></div>
   *     </Transform2d>
   *   </Transform>
   * </Transform2d>
   *
   * Is basically the same (assuming all the nested divs are positioned absolutely in the same place) as:
   *
   * <div style="transform: translate(100px, 100px)>
   *   <div style="transform: rotate(0.7854rad)">
   *     <div style="transform: scale(2)">
   *       <div></div>
   *     </div>
   *   </div>
   * </div>
   */
  PRE: 'PRE',
};

export const vec2Obj = (props, propName, componentName) => {
  const passes = isVec2Shape(props[propName]);
  return passes ? null : new Error(`${propName} in ${componentName} is not a vec2 shape`);
};

export const vec3Obj = (props, propName, componentName) => {
  const passes = isVec3Shape(props[propName]);
  return passes ? null : new Error(`${propName} in ${componentName} is not a vec3 shape`);
};

export const vec2GlMatrix = (props, propName, componentName) => {
  const passes = isVec2(props[propName]);
  return passes ? null : new Error(`${propName} in ${componentName} is not a gl-matrix vec2`);
};

export const vec3GlMatrix = (props, propName, componentName) => {
  const passes = isVec3(props[propName]);
  return passes ? null : new Error(`${propName} in ${componentName} is not a gl-matrix vec3`);
};

export const mat2dGlMatrix = (props, propName, componentName) => {
  const passes = isMat2d(props[propName]);
  return passes ? null : new Error(`${propName} in ${componentName} is not a gl-matrix mat2d`);
};

export const mat4GlMatrix = (props, propName, componentName) => {
  const passes = isMat4(props[propName]);
  return passes ? null : new Error(`${propName} in ${componentName} is not a gl-matrix mat4`);
};
