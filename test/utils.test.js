import { vec2, vec3, glMatrix } from 'gl-matrix';
import { setVec2FromProp, setVec3FromProp } from '../src/utils';

describe('utils', () => {
  describe('setVec2FromProp', () => {
    let out;

    beforeEach(() => {
      out = vec2.create();
    });

    function runVec2SharedTests() {
      it('returns a vec2 with 0 when the prop is not set', () => {
        const res = setVec2FromProp(out, undefined);

        expect(res).toBe(out);
        expect(res[0]).toEqual(0);
        expect(res[1]).toEqual(0);
      });

      it('returns a vec2 with the default values when the prop is not set and a default value is set', () => {
        const res = setVec2FromProp(out, undefined, 2);

        expect(res).toBe(out);
        expect(res[0]).toEqual(2);
        expect(res[1]).toEqual(2);
      });

      it('returns a vec2 with the correct values when the prop is a number', () => {
        const res = setVec2FromProp(out, 1);

        expect(res).toBe(out);
        expect(res[0]).toEqual(1);
        expect(res[1]).toEqual(1);
      });

      it('returns a vec2 with the correct values when the prop is an object', () => {
        const res = setVec2FromProp(out, { x: 10, y: 20 });

        expect(res).toBe(out);
        expect(res[0]).toEqual(10);
        expect(res[1]).toEqual(20);
      });

      it('returns a vec2 with the correct values when the prop is a partial object with x', () => {
        const res = setVec2FromProp(out, { x: 10 });

        expect(res).toBe(out);
        expect(res[0]).toEqual(10);
        expect(res[1]).toEqual(0);
      });

      it('returns a vec2 with the correct values when the prop is a partial object with x and a default value is set', () => {
        const res = setVec2FromProp(out, { x: 10 }, 1);

        expect(res).toBe(out);
        expect(res[0]).toEqual(10);
        expect(res[1]).toEqual(1);
      });

      it('returns a vec2 with the correct values when the prop is a partial object with y', () => {
        const res = setVec2FromProp(out, { y: 10 });

        expect(res).toBe(out);
        expect(res[0]).toEqual(0);
        expect(res[1]).toEqual(10);
      });

      it('returns a vec2 with the correct values when the prop is a partial object with y and a default value is set', () => {
        const res = setVec2FromProp(out, { y: 10 }, 1);

        expect(res).toBe(out);
        expect(res[0]).toEqual(1);
        expect(res[1]).toEqual(10);
      });

      it('returns a vec2 with the correct values when the prop is a vec2', () => {
        const vIn = vec2.fromValues(10, 20);
        const res = setVec2FromProp(out, vIn);

        expect(res).toBe(out);
        expect(res[0]).toEqual(10);
        expect(res[1]).toEqual(20);
      });
    }

    describe('using Float32Array', () => {
      it('is using a Float32Array', () => {
        expect(glMatrix.ARRAY_TYPE).toBe(Float32Array);
      });

      runVec2SharedTests();
    });

    describe('using Array', () => {
      let originalArrayType;

      beforeAll(() => {
        originalArrayType = glMatrix.ARRAY_TYPE;
        glMatrix.ARRAY_TYPE = Array;
      });

      afterAll(() => {
        glMatrix.ARRAY_TYPE = originalArrayType;
      });

      it('is using an Array', () => {
        expect(glMatrix.ARRAY_TYPE).toBe(Array);
      });

      runVec2SharedTests();
    });
  });

  describe('setVec3FromProp', () => {
    let out;

    beforeEach(() => {
      out = vec3.create();
    });

    function runVec3SharedTests() {
      it('returns a vec3 with 0 when the prop is not set', () => {
        const res = setVec3FromProp(out, undefined);

        expect(res).toBe(out);
        expect(res[0]).toEqual(0);
        expect(res[1]).toEqual(0);
        expect(res[2]).toEqual(0);
      });

      it('returns a vec3 with the default values when the prop is not set and default value are set', () => {
        const res = setVec3FromProp(out, undefined, 1, 2, 3);

        expect(res).toBe(out);
        expect(res[0]).toEqual(1);
        expect(res[1]).toEqual(2);
        expect(res[2]).toEqual(3);
      });

      it('returns a vec3 with the correct values when the prop is a number', () => {
        const res = setVec3FromProp(out, 1);

        expect(res).toBe(out);
        expect(res[0]).toEqual(1);
        expect(res[1]).toEqual(1);
        expect(res[2]).toEqual(1);
      });

      it('returns a vec3 with the correct values when the prop is an object', () => {
        const res = setVec3FromProp(out, { x: 10, y: 20, z: 30 });

        expect(res).toBe(out);
        expect(res[0]).toEqual(10);
        expect(res[1]).toEqual(20);
        expect(res[2]).toEqual(30);
      });

      it('returns a vec3 with the correct values when the prop is a partial object with x', () => {
        const res = setVec3FromProp(out, { x: 10 });

        expect(res).toBe(out);
        expect(res[0]).toEqual(10);
        expect(res[1]).toEqual(0);
        expect(res[2]).toEqual(0);
      });

      it('returns a vec3 with the correct values when the prop is a partial object with x and default values are set', () => {
        const res = setVec3FromProp(out, { x: 10 }, 1, 2, 3);

        expect(res).toBe(out);
        expect(res[0]).toEqual(10);
        expect(res[1]).toEqual(2);
        expect(res[2]).toEqual(3);
      });

      it('returns a vec3 with the correct values when the prop is a partial object with y', () => {
        const res = setVec3FromProp(out, { y: 10 });

        expect(res).toBe(out);
        expect(res[0]).toEqual(0);
        expect(res[1]).toEqual(10);
        expect(res[2]).toEqual(0);
      });

      it('returns a vec3 with the correct values when the prop is a partial object with y and default values are set', () => {
        const res = setVec3FromProp(out, { y: 10 }, 1, 2, 3);

        expect(res).toBe(out);
        expect(res[0]).toEqual(1);
        expect(res[1]).toEqual(10);
        expect(res[2]).toEqual(3);
      });

      it('returns a vec3 with the correct values when the prop is a partial object with z', () => {
        const res = setVec3FromProp(out, { z: 10 });

        expect(res).toBe(out);
        expect(res[0]).toEqual(0);
        expect(res[1]).toEqual(0);
        expect(res[2]).toEqual(10);
      });

      it('returns a vec3 with the correct values when the prop is a partial object with y and default values are set', () => {
        const res = setVec3FromProp(out, { z: 10 }, 1, 2, 3);

        expect(res).toBe(out);
        expect(res[0]).toEqual(1);
        expect(res[1]).toEqual(2);
        expect(res[2]).toEqual(10);
      });

      it('returns a vec3 with the correct values when the prop is a vec3', () => {
        const vIn = vec3.fromValues(10, 20, 30);
        const res = setVec3FromProp(out, vIn);

        expect(res).toBe(out);
        expect(res[0]).toEqual(10);
        expect(res[1]).toEqual(20);
        expect(res[2]).toEqual(30);
      });
    }

    describe('using Float32Array', () => {
      it('is using a Float32Array', () => {
        expect(glMatrix.ARRAY_TYPE).toBe(Float32Array);
      });

      runVec3SharedTests();
    });

    describe('using Array', () => {
      let originalArrayType;

      beforeAll(() => {
        originalArrayType = glMatrix.ARRAY_TYPE;
        glMatrix.ARRAY_TYPE = Array;
      });

      afterAll(() => {
        glMatrix.ARRAY_TYPE = originalArrayType;
      });

      it('is using an Array', () => {
        expect(glMatrix.ARRAY_TYPE).toBe(Array);
      });

      runVec3SharedTests();
    });
  });
});
