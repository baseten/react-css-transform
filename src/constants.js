import PropTypes from 'prop-types';
import { glMatrix } from 'gl-matrix';

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

export const vec2Shape = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
});

export const vec3Shape = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
});

export const glMatrixType = PropTypes.instanceOf(glMatrix.ARRAY_TYPE);
