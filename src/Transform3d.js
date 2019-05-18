import React from 'react';
import PropTypes from 'prop-types';
import { mat4, vec3 } from 'gl-matrix';

import { MULTIPLICATION_ORDER, vec3Shape, glMatrixType } from './constants';
import { setVec3FromProp } from './utils';

export default class Transform3d extends React.Component {
  static propTypes = {
    parentMatrixWorld: glMatrixType,
    multiplicationOrder: PropTypes.oneOf([MULTIPLICATION_ORDER.PRE, MULTIPLICATION_ORDER.POST]),
    translate: PropTypes.oneOfType([glMatrixType, vec3Shape]),
    scale: PropTypes.oneOfType([glMatrixType, vec3Shape, PropTypes.number]),
    rotate: PropTypes.number,
    rotateAxis: PropTypes.oneOfType([glMatrixType, vec3Shape]),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
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

    mat4.identity(matrix);

    setVec3FromProp(vTranslation, translate);
    setVec3FromProp(vScale, scale, 1, 1, 1);
    setVec3FromProp(vRotationAxis, rotateAxis, 0, 0, 1);

    // T * R * S
    mat4.translate(matrix, matrix, vTranslation);
    mat4.rotate(matrix, matrix, rotate || 0, vRotationAxis);
    mat4.scale(matrix, matrix, vScale);

    if (multiplicationOrder === MULTIPLICATION_ORDER.PRE) {
      mat4.multiply(matrixWorld, matrix, parentMatrixWorld);
    } else if (multiplicationOrder === MULTIPLICATION_ORDER.POST) {
      mat4.multiply(matrixWorld, parentMatrixWorld, matrix);
    }

    if (typeof children === 'function') {
      return children({
        parentMatrixWorld: matrixWorld,
        multiplicationOrder,
        style: {
          transform: matrixWorld.join(','),
        },
      });
    }

    return React.Children.map(children, this.renderChild);
  }

  renderChild = child => {
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
