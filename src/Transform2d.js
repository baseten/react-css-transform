import React from 'react';
import PropTypes from 'prop-types';
import { mat2d, vec2 } from 'gl-matrix';

import { MULTIPLICATION_ORDER, vec2Shape, glMatrixType } from './constants';
import { setVec2FromProp } from './utils';

export default class Transform2d extends React.Component {
  static propTypes = {
    parentMatrixWorld: glMatrixType,
    multiplicationOrder: PropTypes.oneOf([MULTIPLICATION_ORDER.PRE, MULTIPLICATION_ORDER.POST]),
    translate: PropTypes.oneOfType([glMatrixType, vec2Shape]),
    scale: PropTypes.oneOfType([glMatrixType, vec2Shape, PropTypes.number]),
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

    mat2d.identity(matrix);

    setVec2FromProp(vTranslation, translate);
    setVec2FromProp(vScale, scale, 1);

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
