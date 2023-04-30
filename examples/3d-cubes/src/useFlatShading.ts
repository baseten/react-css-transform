import { useMemo } from 'react';
import { useFactoryRef } from 'react-css-transform';
import { vec3, mat3, mat4 } from 'gl-matrix';
import { clamp, hexToVec3, vec3ToRgbString } from './utils';

type UseFlatShadingParameters = {
  diffuseColor: string;
  emissiveColor: string;
  lightColor: string;
  objectLocalPosition: vec3;
  objectLocalNormal: vec3;
  lightWorldPosition: vec3;
  parentMatrixWorld: mat4;
};

const useVec3Color = (hexColor: string) =>
  useMemo(() => hexToVec3(hexColor), [hexColor]);

const useRgbColor = (hexColor: string) =>
  useMemo(() => hexToVec3(hexColor, 1), [hexColor]);

export const useFlatShading = ({
  diffuseColor,
  emissiveColor,
  lightColor,
  objectLocalPosition,
  objectLocalNormal,
  lightWorldPosition,
  parentMatrixWorld,
}: UseFlatShadingParameters) => {
  const vOutputColor = useFactoryRef<vec3>(() => vec3.create());
  const vObjectToLightWorldPosition = useFactoryRef<vec3>(() => vec3.create());
  const vWorldNormal = useFactoryRef<vec3>(() => vec3.create());
  const mNormalMatrix = useFactoryRef<mat3>(() => mat3.create());

  vec3.zero(vOutputColor.current);
  vec3.zero(vObjectToLightWorldPosition.current);
  vec3.zero(vWorldNormal.current);
  mat3.identity(mNormalMatrix.current);

  const vDiffuseColor = useVec3Color(diffuseColor);
  const vEmissiveColor = useVec3Color(emissiveColor);
  const vLightColor = useVec3Color(lightColor);

  // transform local normal to world coords
  mat3.normalFromMat4(mNormalMatrix.current, parentMatrixWorld);
  vec3.transformMat3(
    vWorldNormal.current,
    objectLocalNormal,
    mNormalMatrix.current,
  );
  // transform local position to world coords
  vec3.transformMat4(
    vObjectToLightWorldPosition.current,
    objectLocalPosition,
    parentMatrixWorld,
  );

  // compute vector from object to light in world coords and normalize
  vec3.sub(
    vObjectToLightWorldPosition.current,
    lightWorldPosition,
    vObjectToLightWorldPosition.current,
  );
  vec3.normalize(
    vObjectToLightWorldPosition.current,
    vObjectToLightWorldPosition.current,
  );

  // compute flat shaded color
  const diffuseLight = clamp(
    vec3.dot(vWorldNormal.current, vObjectToLightWorldPosition.current),
    0,
    1,
  );

  vec3.multiply(vOutputColor.current, vDiffuseColor, vLightColor);
  vec3.scale(vOutputColor.current, vOutputColor.current, diffuseLight);

  vec3.add(vOutputColor.current, vOutputColor.current, vEmissiveColor);

  return {
    outputColor: vOutputColor.current,
    outputColorString: vec3ToRgbString(vOutputColor.current),
  };
};
