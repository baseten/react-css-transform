import type React from 'react';
import type { vec2, vec3 } from 'gl-matrix';

export type GLMatrixType = Array<number> | Float32Array;
export type Vec2Object = {
  x?: number;
  y?: number;
};
export type Vec3Object = Vec2Object & {
  z?: number;
};
export type Vec2SettableProperty = number | vec2 | Vec2Object;
export type Vec3SettableProperty = number | vec3 | Vec3Object;

/**
 * POST is the default, more natural mathematically and (arguably) more useful, it behaves in the same order as when
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
 *
 * PRE mimics how CSS transforms work between nested DOM elements
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
export type MultiplicationOrder = 'PRE' | 'POST';

export type CSSMatrixPrefix = 'matrix' | 'matrix3d';

export type TransformChildProps<Matrix extends GLMatrixType> = {
  parentMatrixWorld?: Matrix;
  multiplicationOrder?: MultiplicationOrder;
  style?: React.CSSProperties;
};

export type TransformChildFunction<Matrix extends GLMatrixType> = (
  params: TransformChildProps<Matrix>,
) => JSX.Element;

export type TransformChildren<Matrix extends GLMatrixType> =
  | React.ReactElement
  | React.ReactElement[]
  | TransformChildFunction<Matrix>;
