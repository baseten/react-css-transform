import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { vec3 } from 'gl-matrix';
import {
  Transform3d,
  Transform3dProps,
  useFactoryRef,
} from 'react-css-transform';
import { Face } from './Face';
import { halfPi, yAxis, xAxis } from '../constants';

const propTypes = {
  faceSize: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

type CubeProps = Transform3dProps & {
  faceSize: number;
  color: string;
};

export const Cube = ({ faceSize, color, ...otherProps }: CubeProps) => {
  const pos1 = useFactoryRef<vec3>(() => vec3.create());
  const pos2 = useFactoryRef<vec3>(() => vec3.create());
  const pos3 = useFactoryRef<vec3>(() => vec3.create());
  const pos4 = useFactoryRef<vec3>(() => vec3.create());
  const pos5 = useFactoryRef<vec3>(() => vec3.create());
  const pos6 = useFactoryRef<vec3>(() => vec3.create());

  const halfFaceSize = faceSize / 2;
  const faceStyle = useMemo(
    () => ({
      width: faceSize,
      height: faceSize,
      margin: -halfFaceSize,
    }),
    [faceSize, halfFaceSize],
  );

  vec3.set(pos1.current, -halfFaceSize, 0, 0);
  vec3.set(pos2.current, halfFaceSize, 0, 0);
  vec3.set(pos3.current, 0, -halfFaceSize, 0);
  vec3.set(pos4.current, 0, halfFaceSize, 0);
  vec3.set(pos5.current, 0, 0, -halfFaceSize);
  vec3.set(pos6.current, 0, 0, halfFaceSize);

  return (
    <Transform3d {...otherProps}>
      <Face
        translate={pos1.current}
        rotate={-halfPi}
        rotateAxis={yAxis}
        color={color}
        style={faceStyle}
      />
      <Face
        translate={pos2.current}
        rotate={halfPi}
        rotateAxis={yAxis}
        color={color}
        style={faceStyle}
      />
      <Face
        translate={pos3.current}
        rotate={halfPi}
        rotateAxis={xAxis}
        color={color}
        style={faceStyle}
      />
      <Face
        translate={pos4.current}
        rotate={-halfPi}
        rotateAxis={xAxis}
        color={color}
        style={faceStyle}
      />
      <Face
        translate={pos5.current}
        rotate={Math.PI}
        rotateAxis={yAxis}
        color={color}
        style={faceStyle}
      />
      <Face translate={pos6.current} color={color} style={faceStyle} />
    </Transform3d>
  );
};

Cube.propTypes = propTypes;
