import React from 'react';
import PropTypes from 'prop-types';
import { mat4, vec3 } from 'gl-matrix';

import { MULTIPLICATION_ORDER, vec3Obj, vec3GlMatrix, mat4GlMatrix } from './constants';
import { setVec3FromProp } from './utils';

export default class Transform3d extends React.Component {
  static propTypes = {
    parentMatrixWorld: mat4GlMatrix,
    multiplicationOrder: PropTypes.oneOf([MULTIPLICATION_ORDER.PRE, MULTIPLICATION_ORDER.POST]),
    translate: PropTypes.oneOfType([vec3GlMatrix, vec3Obj]),
    scale: PropTypes.oneOfType([vec3GlMatrix, vec3Obj, PropTypes.number]),
    rotate: PropTypes.number,
    rotateAxis: PropTypes.oneOfType([vec3GlMatrix, vec3Obj]),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  static defaultProps = {
    parentMatrixWorld: mat4.create(),
    multiplicationOrder: MULTIPLICATION_ORDER.POST,
    rotateAxis: {
      x: 0,
      y: 0,
      z: 1,
    },
  };

  matrix = mat4.create();
  matrixWorld = mat4.create();
  vTranslation = vec3.create();
  vScale = vec3.create();
  vRotationAxis = vec3.create();

  render() {
    const { children, parentMatrixWorld, multiplicationOrder, translate, rotate, rotateAxis, scale } = this.props;
    const { matrix, matrixWorld, vTranslation, vScale, vRotationAxis } = this;

    if (!children) {
      return null;
    }

    const theta = typeof rotate === 'number' ? rotate : 0;

    mat4.identity(matrix);

    setVec3FromProp(vTranslation, translate);
    setVec3FromProp(vScale, scale, 1, 1, 1);
    setVec3FromProp(vRotationAxis, rotateAxis, 0, 0, 1);

    // T * R * S
    mat4.translate(matrix, matrix, vTranslation);
    mat4.rotate(matrix, matrix, theta, vRotationAxis);
    mat4.scale(matrix, matrix, vScale);

    if (multiplicationOrder === MULTIPLICATION_ORDER.PRE) {
      mat4.multiply(matrixWorld, matrix, parentMatrixWorld);
    } else {
      mat4.multiply(matrixWorld, parentMatrixWorld, matrix);
    }

    if (typeof children === 'function') {
      return children({
        parentMatrixWorld: matrixWorld,
        multiplicationOrder,
        style: {
          transform: `matrix3d(${matrixWorld.join(',')})`,
        },
      });
    }

    return React.Children.map(children, this.renderChild);
  }

  renderChild = child => {
    if (!child) {
      return null;
    }

    const { multiplicationOrder } = this.props;
    const { matrixWorld } = this;

    const childStyle = child.props.style || {};
    const style = {
      ...childStyle,
      transform: `matrix3d(${matrixWorld.join(',')})`,
    };

    const childProps = {
      style,
    };

    if (typeof child.type !== 'string') {
      childProps.parentMatrixWorld = matrixWorld;
      childProps.multiplicationOrder = multiplicationOrder;
    }

    return React.cloneElement(child, childProps);
  };
}
