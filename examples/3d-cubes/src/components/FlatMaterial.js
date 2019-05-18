import React from 'react';
import PropTypes from 'prop-types';
import { glMatrixType } from 'react-css-transform';
import { vec3, mat3 } from 'gl-matrix';

function hexStringToRgb(hexString) {
  let parsedHexString;

  if (hexString.length === 4) {
    parsedHexString = hexString[1] + hexString[1] + hexString[2] + hexString[2] + hexString[3] + hexString[3];
  } else {
    parsedHexString = hexString.substring(1);
  }

  return [
    parseInt(parsedHexString[0] + parsedHexString[1], 16),
    parseInt(parsedHexString[2] + parsedHexString[3], 16),
    parseInt(parsedHexString[4] + hexString[5], 16),
  ];
}

function blendRgbArrayColors(color1, color2, percentage) {
  return [
    (1 - percentage) * color1[0] + percentage * color2[0],
    (1 - percentage) * color1[1] + percentage * color2[1],
    (1 - percentage) * color1[2] + percentage * color2[2],
  ];
}

function rgbArrayToString(rgb) {
  // safari won't process floats in rgb
  return `rgb(${rgb.map(val => Math.round(val)).join(',')})`;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export class FlatMaterial extends React.Component {
  // all DOM elements are born this way :)
  position = vec3.create();
  normal = vec3.fromValues(0, 0, 1);

  positionToLight = vec3.create();
  worldNormal = vec3.create();

  normalMatrix = mat3.create();

  lightPos = vec3.create();

  constructor(props) {
    super(props);

    const { color } = props;
    const colorRgb = hexStringToRgb(color);
    const whiteColor = blendRgbArrayColors(colorRgb, [255, 255, 255], 0.1);

    this.colorRgb = whiteColor;
    this.shadowColorRgb = blendRgbArrayColors(this.colorRgb, [0, 0, 0], 0.333);
  }

  render() {
    const { parentMatrixWorld, children, style } = this.props;
    const { position, normal, normalMatrix, positionToLight, worldNormal, shadowColorRgb, colorRgb, lightPos } = this;

    // hardcode for now
    vec3.set(lightPos, window.innerWidth / 3, window.innerHeight / 3, 0);

    mat3.normalFromMat4(normalMatrix, parentMatrixWorld);
    vec3.transformMat3(worldNormal, normal, normalMatrix);
    vec3.transformMat4(positionToLight, position, parentMatrixWorld);

    vec3.sub(positionToLight, lightPos, positionToLight);

    vec3.normalize(positionToLight, positionToLight);

    const cosAngle = clamp(vec3.dot(worldNormal, positionToLight), 0, 1);
    const color = blendRgbArrayColors(shadowColorRgb, colorRgb, cosAngle);

    const childStyle = children.props.style || {};
    const finalStyle = {
      ...childStyle,
      ...style,
      backgroundColor: rgbArrayToString(color),
    };

    return React.cloneElement(children, { style: finalStyle });
  }
}

FlatMaterial.propTypes = {
  color: PropTypes.string.isRequired,
  parentMatrixWorld: glMatrixType,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};
