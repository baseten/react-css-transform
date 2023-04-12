import { vec2, vec3, mat2d, mat4 } from 'gl-matrix';
import {
  vec2Obj,
  vec3Obj,
  vec2GlMatrix,
  vec3GlMatrix,
  mat2dGlMatrix,
  mat4GlMatrix,
} from '../src/constants';

const COMPONENT_NAME = 'COMPONENT';

describe('vec2Obj', () => {
  it('returns null when passed an obj with an x property', () => {
    expect(vec2Obj({ foo: { x: 0 } }, 'foo', COMPONENT_NAME)).toEqual(null);
  });

  it('returns null when passed an obj with a y property', () => {
    expect(vec2Obj({ foo: { y: 0 } }, 'foo', COMPONENT_NAME)).toEqual(null);
  });

  const types: Record<string, any> = {
    'a number': 1,
    'a boolean': true,
    'a string': 'hello',
    undefined,
    null: null,
    'an object without x or y': { foo: 'bar' },
    'an array of incorrect length': [0, 0, 0, 0],
  };

  Object.keys(types).forEach((key) => {
    it(`returns an error when passed ${key}`, () => {
      const expected = new Error('foo in COMPONENT is not a vec2 shape');

      expect(vec2Obj({ foo: types[key] }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    });
  });
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

  const types: Record<string, any> = {
    'a number': 1,
    'a boolean': true,
    'a string': 'hello',
    undefined,
    null: null,
    'an object without x, y or z': { foo: 'bar' },
    'an array of incorrect length': [0, 0, 0, 0],
  };

  Object.keys(types).forEach((key) => {
    it(`returns an error when passed ${key}`, () => {
      const expected = new Error('foo in COMPONENT is not a vec3 shape');

      expect(vec3Obj({ foo: types[key] }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    });
  });
});

describe('vec2GlMatrix', () => {
  it('returns null when passed a vec2', () => {
    expect(vec2GlMatrix({ foo: vec2.create() }, 'foo', COMPONENT_NAME)).toEqual(
      null,
    );
  });

  const types: Record<string, any> = {
    'a number': 1,
    'a boolean': true,
    'a string': 'hello',
    undefined,
    null: null,
    'an object not a Float32Array': {},
    'an array of incorrect length': [0, 0, 0, 0],
  };

  Object.keys(types).forEach((key) => {
    it(`returns an error when passed ${key}`, () => {
      const expected = new Error('foo in COMPONENT is not a gl-matrix vec2');

      expect(vec2GlMatrix({ foo: types[key] }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    });
  });
});

describe('vec3GlMatrix', () => {
  it('returns null when passed a vec3', () => {
    expect(vec3GlMatrix({ foo: vec3.create() }, 'foo', COMPONENT_NAME)).toEqual(
      null,
    );
  });

  const types: Record<string, any> = {
    'a number': 1,
    'a boolean': true,
    'a string': 'hello',
    undefined,
    null: null,
    'an object not a Float32Array': {},
    'an array of incorrect length': [0, 0, 0, 0],
  };

  Object.keys(types).forEach((key) => {
    it(`returns an error when passed ${key}`, () => {
      const expected = new Error('foo in COMPONENT is not a gl-matrix vec3');

      expect(vec3GlMatrix({ foo: types[key] }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    });
  });
});

describe('mat2GlMatrix', () => {
  it('returns null when passed a mat2d', () => {
    expect(
      mat2dGlMatrix({ foo: mat2d.create() }, 'foo', COMPONENT_NAME),
    ).toEqual(null);
  });

  const types: Record<string, any> = {
    'a number': 1,
    'a boolean': true,
    'a string': 'hello',
    undefined,
    null: null,
    'an object not a Float32Array': {},
    'an array of incorrect length': [0, 0, 0, 0],
  };

  Object.keys(types).forEach((key) => {
    it(`returns an error when passed ${key}`, () => {
      const expected = new Error('foo in COMPONENT is not a gl-matrix mat2d');

      expect(mat2dGlMatrix({ foo: types[key] }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    });
  });
});

describe('mat4GlMatrix', () => {
  it('returns null when passed a mat4', () => {
    expect(mat4GlMatrix({ foo: mat4.create() }, 'foo', COMPONENT_NAME)).toEqual(
      null,
    );
  });

  const types: Record<string, any> = {
    'a number': 1,
    'a boolean': true,
    'a string': 'hello',
    undefined,
    null: null,
    'an object not a Float32Array': {},
    'an array of incorrect length': [0, 0, 0, 0],
  };

  Object.keys(types).forEach((key) => {
    it(`returns an error when passed ${key}`, () => {
      const expected = new Error('foo in COMPONENT is not a gl-matrix mat4');

      expect(mat4GlMatrix({ foo: types[key] }, 'foo', COMPONENT_NAME)).toEqual(
        expected,
      );
    });
  });
});
