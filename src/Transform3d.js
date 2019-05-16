import React from 'react';
import PropTypes from 'prop-types';
import { mat4, vec3 } from 'gl-matrix';

import { MULTIPLICATION_ORDER, vec3Shape, glMatrixType } from './constants';

export default class Transform3d extends React.Component {
  static propTypes = {
    parentMatrixWorld: glMatrixType,
    multiplicationOrder: PropTypes.oneOf([MULTIPLICATION_ORDER.PRE, MULTIPLICATION_ORDER.POST]),
    translate: vec3Shape,
    scale: PropTypes.oneOfType([vec3Shape, PropTypes.number]),
    rotate: PropTypes.number,
    rotateAxis: vec3Shape,
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

    const tx = translate && translate.x ? translate.x : 0;
    const ty = translate && translate.y ? translate.y : 0;
    const tz = translate && translate.z ? translate.z : 0;

    const theta = typeof rotate === 'number' ? rotate : 0;

    let sx, sy, sz;

    if (typeof scale === 'number') {
      sx = scale;
      sy = scale;
      sz = scale;
    } else {
      sx = scale && scale.x ? scale.x : 1;
      sy = scale && scale.y ? scale.y : 1;
      sz = scale && scale.z ? scale.z : 1;
    }

    vec3.set(vTranslation, tx, ty, tz);
    vec3.set(vScale, sx, sy, sz);
    vec3.set(vRotationAxis, rotateAxis.x, rotateAxis.y, rotateAxis.z);

    mat4.identity(matrix);

    // T * R * S
    mat4.translate(matrix, matrix, vTranslation);
    mat4.rotate(matrix, matrix, theta, vRotationAxis);
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
