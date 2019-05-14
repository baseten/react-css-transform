import React from 'react';
import { shallow } from 'enzyme';
import { mat4, vec3 } from 'gl-matrix';
import { Transform3d, MULTIPLICATION_ORDER } from '../src';

describe('<Transform3d />', () => {
  let props, Comp;

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

  it('renders an HTML child with a style tag and performs the correct matrix calculations', () => {
    const wrapper = shallow(
      <Transform3d {...props}>
        <div className="child" style={{ background: '#f00' }} />
      </Transform3d>
    );
    const instance = wrapper.instance();
    const child = wrapper.find('.child');
    const childProps = child.props();

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

    expect(child.length).toBe(1);
    expect(Object.keys(childProps)).toEqual(expect.not.arrayContaining(['parentMatrixWorld', 'multiplicationOrder']));

    expect(childProps.style).toEqual({
      background: '#f00',
      transform: expect.stringContaining('matrix3d('),
    });
  });

  it('performs the correct calculations when passed PRE as the multiplication order', () => {
    props.multiplicationOrder = MULTIPLICATION_ORDER.PRE;

    const wrapper = shallow(
      <Transform3d {...props}>
        <div className="child" style={{ background: '#f00' }} />
      </Transform3d>
    );
    const instance = wrapper.instance();
    const child = wrapper.find('.child');
    const childProps = child.props();

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
        scale: 2,
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
      expect(instance.matrix[10]).toBeCloseTo(2, 6);
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
      expect(instance.matrixWorld[10]).toBeCloseTo(2, 6);
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
      expect(instance.matrix[10]).toBeCloseTo(2, 6);
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
      expect(instance.matrixWorld[10]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[11]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[12]).toBeCloseTo(30, 6);
      expect(instance.matrixWorld[13]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[14]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[15]).toBeCloseTo(1, 6);
    });
  });
});
