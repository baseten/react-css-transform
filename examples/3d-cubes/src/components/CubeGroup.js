import React from 'react';
import PropTypes from 'prop-types';
import { Transform3d } from 'react-css-transform';
import { Cube } from './Cube';
import { yAxis } from '../constants';

export function CubeGroup(props) {
  const { time, parentMatrixWorld, cubeFaceSize } = props;
  const frameTime = 1000 / 60;
  const theta = (time / frameTime) * 0.04;
  const twoTheta = theta * 2;
  const cubeSpacing = cubeFaceSize * 1.5;

  return (
    <React.Fragment>
      <Cube
        parentMatrixWorld={parentMatrixWorld}
        faceSize={cubeFaceSize}
        translate={{ y: -cubeSpacing }}
        rotate={-theta}
        rotateAxis={yAxis}
        color="#ff0000"
      />
      <Cube
        parentMatrixWorld={parentMatrixWorld}
        faceSize={cubeFaceSize}
        translate={{ y: cubeSpacing }}
        rotate={-theta}
        rotateAxis={yAxis}
        color="#ff0000"
      />
      <Transform3d parentMatrixWorld={parentMatrixWorld} rotate={theta} rotateAxis={yAxis}>
        <Cube
          parentMatrixWorld={parentMatrixWorld}
          faceSize={cubeFaceSize}
          translate={{ x: -cubeSpacing }}
          rotate={-twoTheta}
          rotateAxis={yAxis}
          color="#0000ff"
        />
        <Cube
          parentMatrixWorld={parentMatrixWorld}
          faceSize={cubeFaceSize}
          translate={{ x: cubeSpacing }}
          rotate={-twoTheta}
          rotateAxis={yAxis}
          color="#0000ff"
        />
        <Cube
          parentMatrixWorld={parentMatrixWorld}
          faceSize={cubeFaceSize}
          translate={{ z: -cubeSpacing }}
          rotate={-twoTheta}
          rotateAxis={yAxis}
          color="#00ff00"
        />
        <Cube
          parentMatrixWorld={parentMatrixWorld}
          faceSize={cubeFaceSize}
          translate={{ z: cubeSpacing }}
          rotate={-twoTheta}
          rotateAxis={yAxis}
          color="#00ff00"
        />
      </Transform3d>
    </React.Fragment>
  );
}

CubeGroup.propTypes = {
  cubeFaceSize: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  parentMatrixWorld: PropTypes.oneOfType([PropTypes.instanceOf(Float32Array), PropTypes.array]),
};
