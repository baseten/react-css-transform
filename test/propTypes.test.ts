import { vec2, vec3, mat2d, mat4 } from 'gl-matrix';
import {
  vec2Obj,
  vec3Obj,
  vec2GlMatrix,
  vec3GlMatrix,
  mat2dGlMatrix,
  mat4GlMatrix,
} from '../src/propTypes';

const COMPONENT_NAME = 'COMPONENT';
const INCORRECT_VEC2_SHAPE_ERROR = 'foo in COMPONENT is not a vec2 shape';
const INCORRECT_VEC3_SHAPE_ERROR = 'foo in COMPONENT is not a vec3 shape';
const INCORRECT_VEC2_GLMATRIX_ERROR =
  'foo in COMPONENT is not a gl-matrix vec2';
const INCORRECT_VEC3_GLMATRIX_ERROR =
  'foo in COMPONENT is not a gl-matrix vec3';
const INCORRECT_MAT2D_GLMATRIX_ERROR =
  'foo in COMPONENT is not a gl-matrix mat2d';
const INCORRECT_MAT4_GLMATRIX_ERROR =
  'foo in COMPONENT is not a gl-matrix mat4';

describe('vec2Obj', () => {
  it('returns null when passed an obj with an x property', () => {
    expect(vec2Obj({ foo: { x: 0 } }, 'foo', COMPONENT_NAME)).toEqual(null);
  });

  it('returns null when passed an obj with a y property', () => {
    expect(vec2Obj({ foo: { y: 0 } }, 'foo', COMPONENT_NAME)).toEqual(null);
  });

  it.each`
    description                       | value             | isRequired | expectedErrorMessage
    ${'a number'}                     | ${1}              | ${false}   | ${INCORRECT_VEC2_SHAPE_ERROR}
    ${'a number'}                     | ${1}              | ${true}    | ${INCORRECT_VEC2_SHAPE_ERROR}
    ${'a boolean'}                    | ${true}           | ${false}   | ${INCORRECT_VEC2_SHAPE_ERROR}
    ${'a boolean'}                    | ${true}           | ${true}    | ${INCORRECT_VEC2_SHAPE_ERROR}
    ${'a string'}                     | ${'hello'}        | ${false}   | ${INCORRECT_VEC2_SHAPE_ERROR}
    ${'a string'}                     | ${'hello'}        | ${true}    | ${INCORRECT_VEC2_SHAPE_ERROR}
    ${'undefined'}                    | ${undefined}      | ${false}   | ${null}
    ${'undefined'}                    | ${undefined}      | ${true}    | ${'foo is required in COMPONENT but received undefined'}
    ${'null'}                         | ${null}           | ${false}   | ${null}
    ${'null'}                         | ${null}           | ${true}    | ${'foo is required in COMPONENT but received null'}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${false}   | ${INCORRECT_VEC2_SHAPE_ERROR}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${true}    | ${INCORRECT_VEC2_SHAPE_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${false}   | ${INCORRECT_VEC2_SHAPE_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${true}    | ${INCORRECT_VEC2_SHAPE_ERROR}
  `(
    `returns $expectedErrorMessage when passed $description and isRequired is $isRequired`,
    ({ value, isRequired, expectedErrorMessage }) => {
      const expected = expectedErrorMessage
        ? new Error(expectedErrorMessage)
        : null;
      const validator = isRequired ? vec2Obj.isRequired : vec2Obj;

      expect(validator({ foo: value }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    },
  );
});

describe('vec3Obj', () => {
  it('returns null when passed an obj with an x property', () => {
    expect(vec3Obj({ foo: { x: 0 } }, 'foo', COMPONENT_NAME)).toEqual(null);
  });

  it('returns null when passed an obj with a y property', () => {
    expect(vec3Obj({ foo: { y: 0 } }, 'foo', COMPONENT_NAME)).toEqual(null);
  });

  it('returns null when passed an obj with a z property', () => {
    expect(vec3Obj({ foo: { z: 0 } }, 'foo', COMPONENT_NAME)).toEqual(null);
  });

  it.each`
    description                       | value             | isRequired | expectedErrorMessage
    ${'a number'}                     | ${1}              | ${false}   | ${INCORRECT_VEC3_SHAPE_ERROR}
    ${'a number'}                     | ${1}              | ${true}    | ${INCORRECT_VEC3_SHAPE_ERROR}
    ${'a boolean'}                    | ${true}           | ${false}   | ${INCORRECT_VEC3_SHAPE_ERROR}
    ${'a boolean'}                    | ${true}           | ${true}    | ${INCORRECT_VEC3_SHAPE_ERROR}
    ${'a string'}                     | ${'hello'}        | ${false}   | ${INCORRECT_VEC3_SHAPE_ERROR}
    ${'a string'}                     | ${'hello'}        | ${true}    | ${INCORRECT_VEC3_SHAPE_ERROR}
    ${'undefined'}                    | ${undefined}      | ${false}   | ${null}
    ${'undefined'}                    | ${undefined}      | ${true}    | ${'foo is required in COMPONENT but received undefined'}
    ${'null'}                         | ${null}           | ${false}   | ${null}
    ${'null'}                         | ${null}           | ${true}    | ${'foo is required in COMPONENT but received null'}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${false}   | ${INCORRECT_VEC3_SHAPE_ERROR}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${true}    | ${INCORRECT_VEC3_SHAPE_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${false}   | ${INCORRECT_VEC3_SHAPE_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${true}    | ${INCORRECT_VEC3_SHAPE_ERROR}
  `(
    `returns $expectedErrorMessage when passed $description and isRequired is $isRequired`,
    ({ value, isRequired, expectedErrorMessage }) => {
      const expected = expectedErrorMessage
        ? new Error(expectedErrorMessage)
        : null;
      const validator = isRequired ? vec3Obj.isRequired : vec3Obj;

      expect(validator({ foo: value }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    },
  );
});

describe('vec2GlMatrix', () => {
  it('returns null when passed a vec2', () => {
    expect(vec2GlMatrix({ foo: vec2.create() }, 'foo', COMPONENT_NAME)).toEqual(
      null,
    );
  });

  it.each`
    description                       | value             | isRequired | expectedErrorMessage
    ${'a number'}                     | ${1}              | ${false}   | ${INCORRECT_VEC2_GLMATRIX_ERROR}
    ${'a number'}                     | ${1}              | ${true}    | ${INCORRECT_VEC2_GLMATRIX_ERROR}
    ${'a boolean'}                    | ${true}           | ${false}   | ${INCORRECT_VEC2_GLMATRIX_ERROR}
    ${'a boolean'}                    | ${true}           | ${true}    | ${INCORRECT_VEC2_GLMATRIX_ERROR}
    ${'a string'}                     | ${'hello'}        | ${false}   | ${INCORRECT_VEC2_GLMATRIX_ERROR}
    ${'a string'}                     | ${'hello'}        | ${true}    | ${INCORRECT_VEC2_GLMATRIX_ERROR}
    ${'undefined'}                    | ${undefined}      | ${false}   | ${null}
    ${'undefined'}                    | ${undefined}      | ${true}    | ${'foo is required in COMPONENT but received undefined'}
    ${'null'}                         | ${null}           | ${false}   | ${null}
    ${'null'}                         | ${null}           | ${true}    | ${'foo is required in COMPONENT but received null'}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${false}   | ${INCORRECT_VEC2_GLMATRIX_ERROR}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${true}    | ${INCORRECT_VEC2_GLMATRIX_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${false}   | ${INCORRECT_VEC2_GLMATRIX_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${true}    | ${INCORRECT_VEC2_GLMATRIX_ERROR}
  `(
    `returns $expectedErrorMessage when passed $description and isRequired is $isRequired`,
    ({ value, isRequired, expectedErrorMessage }) => {
      const expected = expectedErrorMessage
        ? new Error(expectedErrorMessage)
        : null;
      const validator = isRequired ? vec2GlMatrix.isRequired : vec2GlMatrix;

      expect(validator({ foo: value }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    },
  );
});

describe('vec3GlMatrix', () => {
  it('returns null when passed a vec3', () => {
    expect(vec3GlMatrix({ foo: vec3.create() }, 'foo', COMPONENT_NAME)).toEqual(
      null,
    );
  });

  it.each`
    description                       | value             | isRequired | expectedErrorMessage
    ${'a number'}                     | ${1}              | ${false}   | ${INCORRECT_VEC3_GLMATRIX_ERROR}
    ${'a number'}                     | ${1}              | ${true}    | ${INCORRECT_VEC3_GLMATRIX_ERROR}
    ${'a boolean'}                    | ${true}           | ${false}   | ${INCORRECT_VEC3_GLMATRIX_ERROR}
    ${'a boolean'}                    | ${true}           | ${true}    | ${INCORRECT_VEC3_GLMATRIX_ERROR}
    ${'a string'}                     | ${'hello'}        | ${false}   | ${INCORRECT_VEC3_GLMATRIX_ERROR}
    ${'a string'}                     | ${'hello'}        | ${true}    | ${INCORRECT_VEC3_GLMATRIX_ERROR}
    ${'undefined'}                    | ${undefined}      | ${false}   | ${null}
    ${'undefined'}                    | ${undefined}      | ${true}    | ${'foo is required in COMPONENT but received undefined'}
    ${'null'}                         | ${null}           | ${false}   | ${null}
    ${'null'}                         | ${null}           | ${true}    | ${'foo is required in COMPONENT but received null'}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${false}   | ${INCORRECT_VEC3_GLMATRIX_ERROR}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${true}    | ${INCORRECT_VEC3_GLMATRIX_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${false}   | ${INCORRECT_VEC3_GLMATRIX_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${true}    | ${INCORRECT_VEC3_GLMATRIX_ERROR}
  `(
    `returns $expectedErrorMessage when passed $description and isRequired is $isRequired`,
    ({ value, isRequired, expectedErrorMessage }) => {
      const expected = expectedErrorMessage
        ? new Error(expectedErrorMessage)
        : null;
      const validator = isRequired ? vec3GlMatrix.isRequired : vec3GlMatrix;

      expect(validator({ foo: value }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    },
  );
});

describe('mat2GlMatrix', () => {
  it('returns null when passed a mat2d', () => {
    expect(
      mat2dGlMatrix({ foo: mat2d.create() }, 'foo', COMPONENT_NAME),
    ).toEqual(null);
  });

  it.each`
    description                       | value             | isRequired | expectedErrorMessage
    ${'a number'}                     | ${1}              | ${false}   | ${INCORRECT_MAT2D_GLMATRIX_ERROR}
    ${'a number'}                     | ${1}              | ${true}    | ${INCORRECT_MAT2D_GLMATRIX_ERROR}
    ${'a boolean'}                    | ${true}           | ${false}   | ${INCORRECT_MAT2D_GLMATRIX_ERROR}
    ${'a boolean'}                    | ${true}           | ${true}    | ${INCORRECT_MAT2D_GLMATRIX_ERROR}
    ${'a string'}                     | ${'hello'}        | ${false}   | ${INCORRECT_MAT2D_GLMATRIX_ERROR}
    ${'a string'}                     | ${'hello'}        | ${true}    | ${INCORRECT_MAT2D_GLMATRIX_ERROR}
    ${'undefined'}                    | ${undefined}      | ${false}   | ${null}
    ${'undefined'}                    | ${undefined}      | ${true}    | ${'foo is required in COMPONENT but received undefined'}
    ${'null'}                         | ${null}           | ${false}   | ${null}
    ${'null'}                         | ${null}           | ${true}    | ${'foo is required in COMPONENT but received null'}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${false}   | ${INCORRECT_MAT2D_GLMATRIX_ERROR}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${true}    | ${INCORRECT_MAT2D_GLMATRIX_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${false}   | ${INCORRECT_MAT2D_GLMATRIX_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${true}    | ${INCORRECT_MAT2D_GLMATRIX_ERROR}
  `(
    `returns $expectedErrorMessage when passed $description and isRequired is $isRequired`,
    ({ value, isRequired, expectedErrorMessage }) => {
      const expected = expectedErrorMessage
        ? new Error(expectedErrorMessage)
        : null;
      const validator = isRequired ? mat2dGlMatrix.isRequired : mat2dGlMatrix;

      expect(validator({ foo: value }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    },
  );
});

describe('mat4GlMatrix', () => {
  it('returns null when passed a mat4', () => {
    expect(mat4GlMatrix({ foo: mat4.create() }, 'foo', COMPONENT_NAME)).toEqual(
      null,
    );
  });

  it.each`
    description                       | value             | isRequired | expectedErrorMessage
    ${'a number'}                     | ${1}              | ${false}   | ${INCORRECT_MAT4_GLMATRIX_ERROR}
    ${'a number'}                     | ${1}              | ${true}    | ${INCORRECT_MAT4_GLMATRIX_ERROR}
    ${'a boolean'}                    | ${true}           | ${false}   | ${INCORRECT_MAT4_GLMATRIX_ERROR}
    ${'a boolean'}                    | ${true}           | ${true}    | ${INCORRECT_MAT4_GLMATRIX_ERROR}
    ${'a string'}                     | ${'hello'}        | ${false}   | ${INCORRECT_MAT4_GLMATRIX_ERROR}
    ${'a string'}                     | ${'hello'}        | ${true}    | ${INCORRECT_MAT4_GLMATRIX_ERROR}
    ${'undefined'}                    | ${undefined}      | ${false}   | ${null}
    ${'undefined'}                    | ${undefined}      | ${true}    | ${'foo is required in COMPONENT but received undefined'}
    ${'null'}                         | ${null}           | ${false}   | ${null}
    ${'null'}                         | ${null}           | ${true}    | ${'foo is required in COMPONENT but received null'}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${false}   | ${INCORRECT_MAT4_GLMATRIX_ERROR}
    ${'an object without x or y'}     | ${{ foo: 'bar' }} | ${true}    | ${INCORRECT_MAT4_GLMATRIX_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${false}   | ${INCORRECT_MAT4_GLMATRIX_ERROR}
    ${'an array of incorrect length'} | ${[0, 0, 0, 0]}   | ${true}    | ${INCORRECT_MAT4_GLMATRIX_ERROR}
  `(
    `returns $expectedErrorMessage when passed $description and isRequired is $isRequired`,
    ({ value, isRequired, expectedErrorMessage }) => {
      const expected = expectedErrorMessage
        ? new Error(expectedErrorMessage)
        : null;
      const validator = isRequired ? mat4GlMatrix.isRequired : mat4GlMatrix;

      expect(validator({ foo: value }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    },
  );
});
