import React from 'react';
import PropTypes from 'prop-types';
import { Transform3d } from 'react-css-transform';
import { FlatMaterial } from './FlatMaterial';
import { halfPi, yAxis, xAxis } from '../constants';

export function Cube(props) {
  const { faceSize, color, ...otherProps } = props;

  const halfFaceSize = faceSize / 2;

  const faceStyle = {
    width: faceSize,
    height: faceSize,
    margin: -halfFaceSize,
  };

  const pos1 = {
    x: -halfFaceSize,
    y: 0,
    z: 0,
  };

  const pos2 = {
    x: halfFaceSize,
    y: 0,
    z: 0,
  };

  const pos3 = {
    x: 0,
    y: -halfFaceSize,
    z: 0,
  };

  const pos4 = {
    x: 0,
    y: halfFaceSize,
    z: 0,
  };

  const pos5 = {
    x: 0,
    y: 0,
    z: -halfFaceSize,
  };

  const pos6 = {
    x: 0,
    y: 0,
    z: halfFaceSize,
  };

  return (
    <Transform3d {...otherProps}>
      <Transform3d translate={pos1} rotate={-halfPi} rotateAxis={yAxis}>
        <FlatMaterial color={color}>
          <div style={faceStyle} className="face" />
        </FlatMaterial>
      </Transform3d>
      <Transform3d translate={pos2} rotate={halfPi} rotateAxis={yAxis}>
        <FlatMaterial color={color}>
          <div style={faceStyle} className="face" />
        </FlatMaterial>
      </Transform3d>
      <Transform3d translate={pos3} rotate={halfPi} rotateAxis={xAxis}>
        <FlatMaterial color={color}>
          <div style={faceStyle} className="face" />
        </FlatMaterial>
      </Transform3d>
      <Transform3d translate={pos4} rotate={-halfPi} rotateAxis={xAxis}>
        <FlatMaterial color={color}>
          <div style={faceStyle} className="face" />
        </FlatMaterial>
      </Transform3d>
      <Transform3d translate={pos5} rotate={Math.PI} rotateAxis={yAxis}>
        <FlatMaterial color={color}>
          <div style={faceStyle} className="face" />
        </FlatMaterial>
      </Transform3d>
      <Transform3d translate={pos6}>
        <FlatMaterial color={color}>
          <div style={faceStyle} className="face" />
        </FlatMaterial>
      </Transform3d>
    </Transform3d>
  );
}

Cube.propTypes = {
  faceSize: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};
