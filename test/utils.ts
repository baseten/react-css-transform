function extractCSSMatrix(element: Element, matrixPrefix: string): number[] {
  const { transform } = getComputedStyle(element);
  return transform
    .substring(`${matrixPrefix}(`.length)
    .slice(0, -1)
    .split(',')
    .map(Number);
}

export function extractCSS2DMatrix(element: Element) {
  return extractCSSMatrix(element, 'matrix');
}

export function extractCSS3DMatrix(element: Element) {
  return extractCSSMatrix(element, 'matrix3d');
}
