import React from 'react';
import PropTypes from 'prop-types';
import { mat2d, vec2 } from 'gl-matrix';

import { MULTIPLICATION_ORDER, vec2Shape, glMatrixType } from './constants';

export default class Transform2d extends React.Component {
  static propTypes = {
    parentMatrixWorld: glMatrixType,
    multiplicationOrder: PropTypes.oneOf([MULTIPLICATION_ORDER.PRE, MULTIPLICATION_ORDER.POST]),
    translate: vec2Shape,
    scale: PropTypes.oneOfType([vec2Shape, glMatrixType, PropTypes.number]),
    rotate: PropTypes.number,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    parentMatrixWorld: mat2d.create(),
    multiplicationOrder: MULTIPLICATION_ORDER.POST,
  };

  matrix = mat2d.create();
  matrixWorld = mat2d.create();
  vTranslation = vec2.create();
  vScale = vec2.create();

  render() {
    const { children, parentMatrixWorld, multiplicationOrder, translate, scale, rotate } = this.props;
    const { matrix, matrixWorld, vTranslation, vScale } = this;

    const tx = translate && translate.x ? translate.x : 0;
    const ty = translate && translate.y ? translate.y : 0;

    let sx, sy;

    if (typeof scale === 'number') {
      sx = scale;
      sy = scale;
    } else {
      sx = scale && scale.x ? scale.x : 1;
      sy = scale && scale.y ? scale.y : 1;
    }

    vec2.set(vTranslation, tx, ty);
    vec2.set(vScale, sx, sy);

    mat2d.identity(matrix);

    // T * R * S
    mat2d.translate(matrix, matrix, vTranslation);
    mat2d.rotate(matrix, matrix, rotate || 0);
    mat2d.scale(matrix, matrix, vScale);

    if (multiplicationOrder === MULTIPLICATION_ORDER.PRE) {
      mat2d.multiply(matrixWorld, matrix, parentMatrixWorld);
    } else if (multiplicationOrder === MULTIPLICATION_ORDER.POST) {
      mat2d.multiply(matrixWorld, parentMatrixWorld, matrix);
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
      transform: `matrix(${matrixWorld.join(',')})`,
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
