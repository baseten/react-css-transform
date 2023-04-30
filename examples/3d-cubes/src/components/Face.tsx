import { merge3dMatrixWithStyles, use3dTransformations } from 'react-css-transform';
import { useGlobalContext } from './GlobalContext';
import { useFlatShading } from '../useFlatShading';
import { vec3 } from 'gl-matrix';
import { useMemo } from 'react';
import { blendHex } from '../utils';

import type { CSSProperties } from 'react';
import type { Transform3dProps } from 'react-css-transform';

type FaceProps = Transform3dProps & {
  color: string;
  style: CSSProperties;
};

// local position is always 0, outer transform will apply positioning
const objectLocalPosition = vec3.fromValues(0, 0, 0);
// local normal is always z: 1, outer transform will apply positioning
const objectLocalNormal = vec3.fromValues(0, 0, 1);

export const Face = ({ color, style, ...transform3dProps }: FaceProps) => {
  const { matrixWorld } = use3dTransformations(transform3dProps);

  const { lightPosition, lightColor } = useGlobalContext();

  const { diffuseColor, emissiveColor } = useMemo(() => {
    return {
      diffuseColor: blendHex(color, '#ffffff', 0.1),
      emissiveColor: blendHex(color, '#000000', 0.5),
    };
  }, [color]);

  const { outputColorString } = useFlatShading({
    diffuseColor,
    emissiveColor,
    lightColor,
    objectLocalPosition,
    objectLocalNormal,
    lightWorldPosition: lightPosition,
    parentMatrixWorld: matrixWorld.current,
  });

  const faceStyle = useMemo(() => {
    return merge3dMatrixWithStyles(matrixWorld.current, {
      ...style,
      backgroundColor: outputColorString,
    });
  }, [matrixWorld, style, outputColorString]);

  return <div style={faceStyle} className="face" />;
};
