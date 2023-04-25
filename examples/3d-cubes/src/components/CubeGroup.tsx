import PropTypes from 'prop-types';
import { vec3 } from 'gl-matrix';
import {
  Transform3d,
  Transform3dProps,
  useFactoryRef,
} from 'react-css-transform';
import { Cube } from './Cube';
import { yAxis } from '../constants';

const propTypes = {
  cubeFaceSize: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  parentMatrixWorld: PropTypes.oneOfType([
    PropTypes.instanceOf(Float32Array),
    PropTypes.array,
  ]),
};

type CubeGroupProps = Transform3dProps & {
  cubeFaceSize: number;
  time: number;
};

const frameTime = 1000 / 60;

export const CubeGroup = ({
  time,
  parentMatrixWorld,
  cubeFaceSize,
}: CubeGroupProps) => {
  const cube1Translate = useFactoryRef<vec3>(() => vec3.create());
  const cube2Translate = useFactoryRef<vec3>(() => vec3.create());
  const cube3Translate = useFactoryRef<vec3>(() => vec3.create());
  const cube4Translate = useFactoryRef<vec3>(() => vec3.create());
  const cube5Translate = useFactoryRef<vec3>(() => vec3.create());
  const cube6Translate = useFactoryRef<vec3>(() => vec3.create());

  const theta = (time / frameTime) * 0.04;
  const twoTheta = theta * 2;
  const cubeSpacing = cubeFaceSize * 1.5;

  vec3.set(cube1Translate.current, 0, -cubeSpacing, 0);
  vec3.set(cube2Translate.current, 0, cubeSpacing, 0);
  vec3.set(cube3Translate.current, -cubeSpacing, 0, 0);
  vec3.set(cube4Translate.current, cubeSpacing, 0, 0);
  vec3.set(cube5Translate.current, 0, 0, -cubeSpacing);
  vec3.set(cube6Translate.current, 0, 0, cubeSpacing);

  return (
    <>
      <Cube
        parentMatrixWorld={parentMatrixWorld}
        faceSize={cubeFaceSize}
        translate={cube1Translate.current}
        rotate={-theta}
        rotateAxis={yAxis}
        color="#ff0000"
      />
      <Cube
        parentMatrixWorld={parentMatrixWorld}
        faceSize={cubeFaceSize}
        translate={cube2Translate.current}
        rotate={-theta}
        rotateAxis={yAxis}
        color="#ff0000"
      />
      <Transform3d
        parentMatrixWorld={parentMatrixWorld}
        rotate={theta}
        rotateAxis={yAxis}
      >
        <Cube
          faceSize={cubeFaceSize}
          translate={cube3Translate.current}
          rotate={-twoTheta}
          rotateAxis={yAxis}
          color="#0000ff"
        />
        <Cube
          faceSize={cubeFaceSize}
          translate={cube4Translate.current}
          rotate={-twoTheta}
          rotateAxis={yAxis}
          color="#0000ff"
        />
        <Cube
          faceSize={cubeFaceSize}
          translate={cube5Translate.current}
          rotate={-twoTheta}
          rotateAxis={yAxis}
          color="#00ff00"
        />
        <Cube
          faceSize={cubeFaceSize}
          translate={cube6Translate.current}
          rotate={-twoTheta}
          rotateAxis={yAxis}
          color="#00ff00"
        />
      </Transform3d>
    </>
  );
};

CubeGroup.propTypes = propTypes;
