import React from 'react';
import PropTypes from 'prop-types';
import { vec3 } from 'gl-matrix';
import { Transform3d } from 'react-css-transform';
import { FlatMaterial } from './FlatMaterial';
import { halfPi, yAxis, xAxis } from '../constants';

export class Cube extends React.Component {
  propTypes = {
    faceSize: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  };

  pos1 = vec3.create();
  pos2 = vec3.create();
  pos3 = vec3.create();
  pos4 = vec3.create();
  pos5 = vec3.create();
  pos6 = vec3.create();

  render() {
    const { faceSize, color, ...otherProps } = this.props;
    const { pos1, pos2, pos3, pos4, pos5, pos6 } = this;

    const halfFaceSize = faceSize / 2;

    const faceStyle = {
      width: faceSize,
      height: faceSize,
      margin: -halfFaceSize,
    };

    vec3.set(pos1, -halfFaceSize, 0, 0);
    vec3.set(pos2, halfFaceSize, 0, 0);
    vec3.set(pos3, 0, -halfFaceSize, 0);
    vec3.set(pos4, 0, halfFaceSize, 0);
    vec3.set(pos5, 0, 0, -halfFaceSize);
    vec3.set(pos6, 0, 0, halfFaceSize);

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
}
