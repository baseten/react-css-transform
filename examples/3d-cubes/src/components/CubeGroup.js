import React from 'react';
import PropTypes from 'prop-types';
import { vec3 } from 'gl-matrix';
import { Transform3d } from 'react-css-transform';
import { Cube } from './Cube';
import { yAxis } from '../constants';

export class CubeGroup extends React.Component {
  static propTypes = {
    cubeFaceSize: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    parentMatrixWorld: PropTypes.oneOfType([PropTypes.instanceOf(Float32Array), PropTypes.array]),
  };

  cube1Translate = vec3.create();
  cube2Translate = vec3.create();
  cube3Translate = vec3.create();
  cube4Translate = vec3.create();
  cube5Translate = vec3.create();
  cube6Translate = vec3.create();

  render() {
    const { time, parentMatrixWorld, cubeFaceSize } = this.props;
    const { cube1Translate, cube2Translate, cube3Translate, cube4Translate, cube5Translate, cube6Translate } = this;

    const frameTime = 1000 / 60;
    const theta = (time / frameTime) * 0.04;
    const twoTheta = theta * 2;
    const cubeSpacing = cubeFaceSize * 1.5;

    vec3.set(cube1Translate, 0, -cubeSpacing, 0);
    vec3.set(cube2Translate, 0, cubeSpacing, 0);
    vec3.set(cube3Translate, -cubeSpacing, 0, 0);
    vec3.set(cube4Translate, cubeSpacing, 0, 0);
    vec3.set(cube5Translate, 0, 0, -cubeSpacing);
    vec3.set(cube6Translate, 0, 0, cubeSpacing);

    return (
      <React.Fragment>
        <Cube
          parentMatrixWorld={parentMatrixWorld}
          faceSize={cubeFaceSize}
          translate={cube1Translate}
          rotate={-theta}
          rotateAxis={yAxis}
          color="#ff0000"
        />
        <Cube
          parentMatrixWorld={parentMatrixWorld}
          faceSize={cubeFaceSize}
          translate={cube2Translate}
          rotate={-theta}
          rotateAxis={yAxis}
          color="#ff0000"
        />
        <Transform3d parentMatrixWorld={parentMatrixWorld} rotate={theta} rotateAxis={yAxis}>
          <Cube
            parentMatrixWorld={parentMatrixWorld}
            faceSize={cubeFaceSize}
            translate={cube3Translate}
            rotate={-twoTheta}
            rotateAxis={yAxis}
            color="#0000ff"
          />
          <Cube
            parentMatrixWorld={parentMatrixWorld}
            faceSize={cubeFaceSize}
            translate={cube4Translate}
            rotate={-twoTheta}
            rotateAxis={yAxis}
            color="#0000ff"
          />
          <Cube
            parentMatrixWorld={parentMatrixWorld}
            faceSize={cubeFaceSize}
            translate={cube5Translate}
            rotate={-twoTheta}
            rotateAxis={yAxis}
            color="#00ff00"
          />
          <Cube
            parentMatrixWorld={parentMatrixWorld}
            faceSize={cubeFaceSize}
            translate={cube6Translate}
            rotate={-twoTheta}
            rotateAxis={yAxis}
            color="#00ff00"
          />
        </Transform3d>
      </React.Fragment>
    );
  }
}
