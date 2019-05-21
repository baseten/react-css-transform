import React from 'react';
import { shallow } from 'enzyme';
import { mat4, vec3 } from 'gl-matrix';
import { Transform3d, MULTIPLICATION_ORDER } from '../src';

describe('<Transform3d />', () => {
  let props, Comp;

  describe('missing or incorrect props', () => {
    beforeEach(() => {
      const identity = mat4.create();
      const parentMatrixWorld = mat4.translate(identity, identity, vec3.fromValues(-10, -10, -10));

      Comp = () => <div />;

      props = {
        parentMatrixWorld,
        translate: {
          x: 10,
          y: 20,
          z: 30,
        },
        scale: 2,
        rotate: Math.PI / 2,
        rotateAxis: {
          x: 0,
          y: 1,
          z: 0,
        },
      };
    });

    it('sets the vTranslation vec3 correctly when no prop is passed', () => {
      delete props.translate;

      const wrapper = shallow(
        <Transform3d {...props}>
          <div />
        </Transform3d>
      );

      const instance = wrapper.instance();

      expect(instance.vTranslation[0]).toEqual(0);
      expect(instance.vTranslation[1]).toEqual(0);
      expect(instance.vTranslation[2]).toEqual(0);
    });

    it('sets the vScale vec3 correctly when no prop is passed', () => {
      delete props.scale;

      const wrapper = shallow(
        <Transform3d {...props}>
          <div />
        </Transform3d>
      );

      const instance = wrapper.instance();

      expect(instance.vScale[0]).toEqual(1);
      expect(instance.vScale[1]).toEqual(1);
      expect(instance.vScale[2]).toEqual(1);
    });

    it('sets the vRotationAxis vec3 correctly when no prop is passed', () => {
      delete props.rotateAxis;

      const wrapper = shallow(
        <Transform3d {...props}>
          <div />
        </Transform3d>
      );

      const instance = wrapper.instance();

      expect(instance.vRotationAxis[0]).toEqual(0);
      expect(instance.vRotationAxis[1]).toEqual(0);
      expect(instance.vRotationAxis[2]).toEqual(1);
    });

    it('sets rotate to 0 when it is passed incorrectly', () => {
      props.rotate = true;

      const wrapper = shallow(
        <Transform3d {...props}>
          <div />
        </Transform3d>
      );

      const instance = wrapper.instance();

      expect(instance.matrix[0]).toBeCloseTo(2, 6);
      expect(instance.matrix[1]).toBeCloseTo(0, 6);
      expect(instance.matrix[2]).toBeCloseTo(0, 6);
      expect(instance.matrix[3]).toBeCloseTo(0, 6);
      expect(instance.matrix[4]).toBeCloseTo(0, 6);
      expect(instance.matrix[5]).toBeCloseTo(2, 6);
      expect(instance.matrix[6]).toBeCloseTo(0, 6);
      expect(instance.matrix[7]).toBeCloseTo(0, 6);
      expect(instance.matrix[8]).toBeCloseTo(0, 6);
      expect(instance.matrix[9]).toBeCloseTo(0, 6);
      expect(instance.matrix[10]).toBeCloseTo(2, 6);
      expect(instance.matrix[11]).toBeCloseTo(0, 6);
      expect(instance.matrix[12]).toBeCloseTo(10, 6);
      expect(instance.matrix[13]).toBeCloseTo(20, 6);
      expect(instance.matrix[14]).toBeCloseTo(30, 6);
      expect(instance.matrix[15]).toBeCloseTo(1, 6);

      expect(instance.matrixWorld[0]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[1]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[2]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[3]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[4]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[5]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[6]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[7]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[8]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[9]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[10]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[11]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[12]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[13]).toBeCloseTo(10, 6);
      expect(instance.matrixWorld[14]).toBeCloseTo(20, 6);
      expect(instance.matrixWorld[15]).toBeCloseTo(1, 6);
    });

    it('renders null when no children passed through', () => {
      const wrapper = shallow(<Transform3d {...props} />);
      expect(wrapper.get(0)).toBe(null);
    });

    it('renders null for a child which returns false', () => {
      // we're mainly testing this doesn't break rendering :)
      const wrapper = shallow(
        <Transform3d {...props}>
          <div />
          {false && <div />}
        </Transform3d>
      );

      expect(wrapper.length).toBe(1);
    });
  });

  function runSharedTests() {
    it('performs the correct matrix calculations', () => {
      const wrapper = shallow(
        <Transform3d {...props}>
          <div />
        </Transform3d>
      );
      const instance = wrapper.instance();

      expect(instance.matrix[0]).toBeCloseTo(0, 6);
      expect(instance.matrix[1]).toBeCloseTo(0, 6);
      expect(instance.matrix[2]).toBeCloseTo(-2, 6);
      expect(instance.matrix[3]).toBeCloseTo(0, 6);
      expect(instance.matrix[4]).toBeCloseTo(0, 6);
      expect(instance.matrix[5]).toBeCloseTo(2, 6);
      expect(instance.matrix[6]).toBeCloseTo(0, 6);
      expect(instance.matrix[7]).toBeCloseTo(0, 6);
      expect(instance.matrix[8]).toBeCloseTo(2, 6);
      expect(instance.matrix[9]).toBeCloseTo(0, 6);
      expect(instance.matrix[10]).toBeCloseTo(0, 6);
      expect(instance.matrix[11]).toBeCloseTo(0, 6);
      expect(instance.matrix[12]).toBeCloseTo(10, 6);
      expect(instance.matrix[13]).toBeCloseTo(20, 6);
      expect(instance.matrix[14]).toBeCloseTo(30, 6);
      expect(instance.matrix[15]).toBeCloseTo(1, 6);

      expect(instance.matrixWorld[0]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[1]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[2]).toBeCloseTo(-2, 6);
      expect(instance.matrixWorld[3]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[4]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[5]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[6]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[7]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[8]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[9]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[10]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[11]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[12]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[13]).toBeCloseTo(10, 6);
      expect(instance.matrixWorld[14]).toBeCloseTo(20, 6);
      expect(instance.matrixWorld[15]).toBeCloseTo(1, 6);
    });

    it('performs the correct calculations when passed PRE as the multiplication order', () => {
      props.multiplicationOrder = MULTIPLICATION_ORDER.PRE;

      const wrapper = shallow(
        <Transform3d {...props}>
          <div />
        </Transform3d>
      );
      const instance = wrapper.instance();

      expect(instance.matrix[0]).toBeCloseTo(0, 6);
      expect(instance.matrix[1]).toBeCloseTo(0, 6);
      expect(instance.matrix[2]).toBeCloseTo(-2, 6);
      expect(instance.matrix[3]).toBeCloseTo(0, 6);
      expect(instance.matrix[4]).toBeCloseTo(0, 6);
      expect(instance.matrix[5]).toBeCloseTo(2, 6);
      expect(instance.matrix[6]).toBeCloseTo(0, 6);
      expect(instance.matrix[7]).toBeCloseTo(0, 6);
      expect(instance.matrix[8]).toBeCloseTo(2, 6);
      expect(instance.matrix[9]).toBeCloseTo(0, 6);
      expect(instance.matrix[10]).toBeCloseTo(0, 6);
      expect(instance.matrix[11]).toBeCloseTo(0, 6);
      expect(instance.matrix[12]).toBeCloseTo(10, 6);
      expect(instance.matrix[13]).toBeCloseTo(20, 6);
      expect(instance.matrix[14]).toBeCloseTo(30, 6);
      expect(instance.matrix[15]).toBeCloseTo(1, 6);

      expect(instance.matrixWorld[0]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[1]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[2]).toBeCloseTo(-2, 6);
      expect(instance.matrixWorld[3]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[4]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[5]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[6]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[7]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[8]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[9]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[10]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[11]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[12]).toBeCloseTo(-10, 6);
      expect(instance.matrixWorld[13]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[14]).toBeCloseTo(50, 6);
      expect(instance.matrixWorld[15]).toBeCloseTo(1, 6);
    });

    it('passes the correct props down to an HTML element', () => {
      const wrapper = shallow(
        <Transform3d {...props}>
          <div className="child" style={{ background: '#f00' }} />
        </Transform3d>
      );
      const child = wrapper.find('.child');
      const childProps = child.props();

      expect(child.length).toBe(1);
      expect(Object.keys(childProps)).toEqual(expect.not.arrayContaining(['parentMatrixWorld', 'multiplicationOrder']));

      expect(childProps.style).toEqual({
        background: '#f00',
        transform: expect.stringContaining('matrix3d('),
      });
    });

    it('passes the correct props down to a React Component', () => {
      const wrapper = shallow(
        <Transform3d {...props}>
          <Comp />
        </Transform3d>
      );
      const instance = wrapper.instance();
      const comp = wrapper.find(Comp);

      expect(comp.props()).toMatchObject({
        parentMatrixWorld: instance.matrixWorld,
        multiplicationOrder: MULTIPLICATION_ORDER.POST,
        style: {
          transform: expect.stringContaining('matrix3d('),
        },
      });
    });

    it('passes the correct props down to multiple React Components', () => {
      const wrapper = shallow(
        <Transform3d {...props}>
          <Comp />
          <Comp />
        </Transform3d>
      );
      const instance = wrapper.instance();
      const comp = wrapper.find(Comp);
      const compProps = comp.map(c => c.props());

      expect(compProps).toAllMatchObject({
        parentMatrixWorld: instance.matrixWorld,
        multiplicationOrder: MULTIPLICATION_ORDER.POST,
        style: {
          transform: expect.stringContaining('matrix3d('),
        },
      });
    });

    it('passes the correct props down to a function as a child', () => {
      const comp = jest.fn();

      const wrapper = shallow(<Transform3d {...props}>{comp}</Transform3d>);
      const instance = wrapper.instance();

      expect(comp).toHaveBeenCalledWith({
        parentMatrixWorld: instance.matrixWorld,
        multiplicationOrder: MULTIPLICATION_ORDER.POST,
        style: {
          transform: expect.stringContaining('matrix3d('),
        },
      });
    });
  }

  describe('props as JS objects', () => {
    beforeEach(() => {
      const identity = mat4.create();
      const parentMatrixWorld = mat4.translate(identity, identity, vec3.fromValues(-10, -10, -10));

      Comp = () => <div />;

      props = {
        parentMatrixWorld,
        translate: {
          x: 10,
          y: 20,
          z: 30,
        },
        scale: 2,
        rotate: Math.PI / 2,
        rotateAxis: {
          x: 0,
          y: 1,
          z: 0,
        },
      };
    });

    runSharedTests();
  });

  describe('props as gl-matrix vec3s', () => {
    beforeEach(() => {
      const identity = mat4.create();
      const parentMatrixWorld = mat4.translate(identity, identity, vec3.fromValues(-10, -10, -10));

      Comp = () => <div />;

      props = {
        parentMatrixWorld,
        translate: vec3.fromValues(10, 20, 30),
        scale: vec3.fromValues(2, 2, 2),
        rotate: Math.PI / 2,
        rotateAxis: vec3.fromValues(0, 1, 0),
      };
    });

    runSharedTests();
  });

  describe('behaves like Transform2d when passed only 2d arguments', () => {
    let props2d;

    beforeEach(() => {
      const identity = mat4.create();
      const parentMatrixWorld = mat4.translate(identity, identity, vec3.fromValues(-10, -10, 0));

      props2d = {
        parentMatrixWorld,
        translate: {
          x: 10,
          y: 20,
        },
        scale: {
          x: 2,
          y: 2,
        },
        rotate: Math.PI / 2,
      };
    });

    it('performs the correct matrix calculations', () => {
      const wrapper = shallow(
        <Transform3d {...props2d}>
          <div className="child" style={{ background: '#f00' }} />
        </Transform3d>
      );
      const instance = wrapper.instance();

      // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
      // matrix(a, b, c, d, tx, ty) is a shorthand for matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1).

      expect(instance.matrix[0]).toBeCloseTo(0, 6);
      expect(instance.matrix[1]).toBeCloseTo(2, 6);
      expect(instance.matrix[2]).toBeCloseTo(0, 6);
      expect(instance.matrix[3]).toBeCloseTo(0, 6);
      expect(instance.matrix[4]).toBeCloseTo(-2, 6);
      expect(instance.matrix[5]).toBeCloseTo(0, 6);
      expect(instance.matrix[6]).toBeCloseTo(0, 6);
      expect(instance.matrix[7]).toBeCloseTo(0, 6);
      expect(instance.matrix[8]).toBeCloseTo(0, 6);
      expect(instance.matrix[9]).toBeCloseTo(0, 6);
      expect(instance.matrix[10]).toBeCloseTo(1, 6);
      expect(instance.matrix[11]).toBeCloseTo(0, 6);
      expect(instance.matrix[12]).toBeCloseTo(10, 6);
      expect(instance.matrix[13]).toBeCloseTo(20, 6);
      expect(instance.matrix[14]).toBeCloseTo(0, 6);
      expect(instance.matrix[15]).toBeCloseTo(1, 6);

      expect(instance.matrixWorld[0]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[1]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[2]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[3]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[4]).toBeCloseTo(-2, 6);
      expect(instance.matrixWorld[5]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[6]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[7]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[8]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[9]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[10]).toBeCloseTo(1, 6);
      expect(instance.matrixWorld[11]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[12]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[13]).toBeCloseTo(10, 6);
      expect(instance.matrixWorld[14]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[15]).toBeCloseTo(1, 6);
    });

    it('performs the correct calculations when passed PRE as the multiplication order', () => {
      props2d.multiplicationOrder = MULTIPLICATION_ORDER.PRE;

      const wrapper = shallow(
        <Transform3d {...props2d}>
          <div className="child" style={{ background: '#f00' }} />
        </Transform3d>
      );
      const instance = wrapper.instance();

      // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
      // matrix(a, b, c, d, tx, ty) is a shorthand for matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, sz, 0, tx, ty, 0, 1).

      expect(instance.matrix[0]).toBeCloseTo(0, 6);
      expect(instance.matrix[1]).toBeCloseTo(2, 6);
      expect(instance.matrix[2]).toBeCloseTo(0, 6);
      expect(instance.matrix[3]).toBeCloseTo(0, 6);
      expect(instance.matrix[4]).toBeCloseTo(-2, 6);
      expect(instance.matrix[5]).toBeCloseTo(0, 6);
      expect(instance.matrix[6]).toBeCloseTo(0, 6);
      expect(instance.matrix[7]).toBeCloseTo(0, 6);
      expect(instance.matrix[8]).toBeCloseTo(0, 6);
      expect(instance.matrix[9]).toBeCloseTo(0, 6);
      expect(instance.matrix[10]).toBeCloseTo(1, 6);
      expect(instance.matrix[11]).toBeCloseTo(0, 6);
      expect(instance.matrix[12]).toBeCloseTo(10, 6);
      expect(instance.matrix[13]).toBeCloseTo(20, 6);
      expect(instance.matrix[14]).toBeCloseTo(0, 6);
      expect(instance.matrix[15]).toBeCloseTo(1, 6);

      expect(instance.matrixWorld[0]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[1]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[2]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[3]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[4]).toBeCloseTo(-2, 6);
      expect(instance.matrixWorld[5]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[6]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[7]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[8]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[9]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[10]).toBeCloseTo(1, 6);
      expect(instance.matrixWorld[11]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[12]).toBeCloseTo(30, 6);
      expect(instance.matrixWorld[13]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[14]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[15]).toBeCloseTo(1, 6);
    });
  });
});
