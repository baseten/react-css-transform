import { mat4, vec3 } from 'gl-matrix';
import { CSSProperties } from 'react';

export function hexToRgb(hexString: string) {
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

export function rgbToHex(r: number, g: number, b: number) {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

const NORMALIZE_RGB_FACTOR = 1 / 255;

export function hexToVec3(
  hexString: string,
  scale: number = NORMALIZE_RGB_FACTOR,
) {
  const [r, g, b] = hexToRgb(hexString);
  const v = vec3.fromValues(r, g, b);
  return vec3.scale(v, v, scale);
}

export function blendRgb(
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

export function blendHex(color1: string, color2: string, percentage: number) {
  const color1Rgb = hexToRgb(color1);
  const color2Rgb = hexToRgb(color2);
  const resultRgb = blendRgb(color1Rgb, color2Rgb, percentage);
  return rgbToHex(
    ...(resultRgb.map((v) => Math.round(v)) as [number, number, number]),
  );
}

export function vec3ToRgbString(rgb: vec3) {
  // safari won't process floats in rgb
  return `rgb(${rgb.map((val) => Math.round(val * 255)).join(',')})`;
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}
