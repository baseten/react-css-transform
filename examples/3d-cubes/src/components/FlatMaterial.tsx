import { cloneElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  mat4GlMatrix,
  Transform3dProps,
  useFactoryRef,
} from 'react-css-transform';
import { vec3, mat3 } from 'gl-matrix';
import { useDimensionsContext } from "./DimensionsContext";

function hexStringToRgb(hexString: string) {
  let parsedHexString;

  if (hexString.length === 4) {
    parsedHexString =
      hexString[1] +
      hexString[1] +
      hexString[2] +
      hexString[2] +
      hexString[3] +
      hexString[3];
  } else {
    parsedHexString = hexString.substring(1);
  }

  return [
    parseInt(parsedHexString[0] + parsedHexString[1], 16),
    parseInt(parsedHexString[2] + parsedHexString[3], 16),
    parseInt(parsedHexString[4] + hexString[5], 16),
  ];
}

function blendRgbArrayColors(
  color1: number[],
  color2: number[],
  percentage: number,
) {
  return [
    (1 - percentage) * color1[0] + percentage * color2[0],
    (1 - percentage) * color1[1] + percentage * color2[1],
    (1 - percentage) * color1[2] + percentage * color2[2],
  ];
}

function rgbArrayToString(rgb: number[]) {
  // safari won't process floats in rgb
  return `rgb(${rgb.map((val) => Math.round(val)).join(',')})`;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const propTypes = {
  color: PropTypes.string.isRequired,
  parentMatrixWorld: mat4GlMatrix,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};

type FlatMaterialProps = Transform3dProps & {
  color: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const FlatMaterial = ({
  color,
  children,
  parentMatrixWorld,
  style,
}: FlatMaterialProps) => {
  const { width, height } = useDimensionsContext();

  const position = useFactoryRef<vec3>(() => vec3.create());
  const normal = useFactoryRef<vec3>(() => vec3.fromValues(0, 0, 1));

  const positionToLight = useFactoryRef<vec3>(() => vec3.create());
  const worldNormal = useFactoryRef<vec3>(() => vec3.create());

  const normalMatrix = useFactoryRef<mat3>(() => mat3.create());

  const lightPos = useFactoryRef<vec3>(() => vec3.create());

  const { colorRgb, shadowColorRgb } = useMemo(() => {
    const colorRgb = hexStringToRgb(color);
    const whiteColor = blendRgbArrayColors(colorRgb, [255, 255, 255], 0.1);

    return {
      colorRgb: whiteColor,
      shadowColorRgb: blendRgbArrayColors(colorRgb, [0, 0, 0], 0.333),
    };
  }, [color]);

  vec3.set(lightPos.current, width / 3, height / 3, 0);

  mat3.normalFromMat4(normalMatrix.current, parentMatrixWorld!);
  vec3.transformMat3(worldNormal.current, normal.current, normalMatrix.current);
  vec3.transformMat4(
    positionToLight.current,
    position.current,
    parentMatrixWorld!,
  );

  vec3.sub(positionToLight.current, lightPos.current, positionToLight.current);

  vec3.normalize(positionToLight.current, positionToLight.current);

  const cosAngle = clamp(
    vec3.dot(worldNormal.current, positionToLight.current),
    0,
    1,
  );

  const outputColor = blendRgbArrayColors(shadowColorRgb, colorRgb, cosAngle);
  // @ts-ignore - allow props check whatever child type
  const childStyle = children?.props?.style ?? {};
  const outputStyle = {
    ...childStyle,
    ...(style ?? {}),
    backgroundColor: rgbArrayToString(outputColor),
  };

  // @ts-ignore - TODO: bug in react types? allow all ReactNode types to cloneElement
  return cloneElement(children, { style: outputStyle });
};

FlatMaterial.propTypes = propTypes;
