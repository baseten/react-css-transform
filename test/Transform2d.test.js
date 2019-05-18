import React from 'react';
import { shallow } from 'enzyme';
import { mat2d, vec2 } from 'gl-matrix';
import { Transform2d, MULTIPLICATION_ORDER } from '../src';

describe('<Transform2d />', () => {
  let props, Comp;

  beforeEach(() => {
    const identity = mat2d.create();
    const parentMatrixWorld = mat2d.translate(identity, identity, vec2.fromValues(-10, -10));

    Comp = () => <div />;

    props = {
      parentMatrixWorld,
      translate: {
        x: 10,
        y: 20,
      },
      scale: 2,
      rotate: Math.PI / 2,
    };
  });

  it('sets the vTranslation vec2 correctly when no prop is passed', () => {
    delete props.translate;

    const wrapper = shallow(
      <Transform2d {...props}>
        <div />
      </Transform2d>
    );

    const instance = wrapper.instance();

    expect(instance.vTranslation[0]).toEqual(0);
    expect(instance.vTranslation[1]).toEqual(0);
  });

  it('sets the vScale vec2 correctly when no prop is passed', () => {
    delete props.scale;

    const wrapper = shallow(
      <Transform2d {...props}>
        <div />
      </Transform2d>
    );

    const instance = wrapper.instance();

    expect(instance.vScale[0]).toEqual(1);
    expect(instance.vScale[1]).toEqual(1);
  });

  it('renders an HTML child with a style tag and performs the correct matrix calculations', () => {
    const wrapper = shallow(
      <Transform2d {...props}>
        <div className="child" style={{ background: '#f00' }} />
      </Transform2d>
    );
    const instance = wrapper.instance();
    const child = wrapper.find('.child');
    const childProps = child.props();

    expect(instance.matrix[0]).toBeCloseTo(0, 6);
    expect(instance.matrix[1]).toBeCloseTo(2, 6);
    expect(instance.matrix[2]).toBeCloseTo(-2, 6);
    expect(instance.matrix[3]).toBeCloseTo(0, 6);
    expect(instance.matrix[4]).toBeCloseTo(10, 6);
    expect(instance.matrix[5]).toBeCloseTo(20, 6);

    expect(instance.matrixWorld[0]).toBeCloseTo(0, 6);
    expect(instance.matrixWorld[1]).toBeCloseTo(2, 6);
    expect(instance.matrixWorld[2]).toBeCloseTo(-2, 6);
    expect(instance.matrixWorld[3]).toBeCloseTo(0, 6);
    expect(instance.matrixWorld[4]).toBeCloseTo(0, 6);
    expect(instance.matrixWorld[5]).toBeCloseTo(10, 6);

    expect(child.length).toBe(1);
    expect(Object.keys(childProps)).toEqual(expect.not.arrayContaining(['parentMatrixWorld', 'multiplicationOrder']));

    expect(childProps.style).toEqual({
      background: '#f00',
      transform: expect.stringContaining('matrix('),
    });
  });

  it('performs the correct calculations when passed PRE as the multiplication order', () => {
    props.multiplicationOrder = MULTIPLICATION_ORDER.PRE;

    const wrapper = shallow(
      <Transform2d {...props}>
        <div className="child" style={{ background: '#f00' }} />
      </Transform2d>
    );
    const instance = wrapper.instance();
    const child = wrapper.find('.child');
    const childProps = child.props();

    expect(instance.matrix[0]).toBeCloseTo(0, 6);
    expect(instance.matrix[1]).toBeCloseTo(2, 6);
    expect(instance.matrix[2]).toBeCloseTo(-2, 6);
    expect(instance.matrix[3]).toBeCloseTo(0, 6);
    expect(instance.matrix[4]).toBeCloseTo(10, 6);
    expect(instance.matrix[5]).toBeCloseTo(20, 6);

    expect(instance.matrixWorld[0]).toBeCloseTo(0, 6);
    expect(instance.matrixWorld[1]).toBeCloseTo(2, 6);
    expect(instance.matrixWorld[2]).toBeCloseTo(-2, 6);
    expect(instance.matrixWorld[3]).toBeCloseTo(0, 6);
    expect(instance.matrixWorld[4]).toBeCloseTo(30, 6);
    expect(instance.matrixWorld[5]).toBeCloseTo(0, 6);

    expect(child.length).toBe(1);
    expect(Object.keys(childProps)).toEqual(expect.not.arrayContaining(['parentMatrixWorld', 'multiplicationOrder']));

    expect(childProps.style).toEqual({
      background: '#f00',
      transform: expect.stringContaining('matrix('),
    });
  });

  it('passes the correct props down to a React Component', () => {
    const wrapper = shallow(
      <Transform2d {...props}>
        <Comp />
      </Transform2d>
    );
    const instance = wrapper.instance();
    const comp = wrapper.find(Comp);

    expect(comp.props()).toMatchObject({
      parentMatrixWorld: instance.matrixWorld,
      multiplicationOrder: MULTIPLICATION_ORDER.POST,
      style: {
        transform: expect.stringContaining('matrix('),
      },
    });
  });

  it('passes the correct props down to multiple React Components', () => {
    const wrapper = shallow(
      <Transform2d {...props}>
        <Comp />
        <Comp />
      </Transform2d>
    );
    const instance = wrapper.instance();
    const comp = wrapper.find(Comp);
    const compProps = comp.map(c => c.props());

    expect(compProps).toAllMatchObject({
      parentMatrixWorld: instance.matrixWorld,
      multiplicationOrder: MULTIPLICATION_ORDER.POST,
      style: {
        transform: expect.stringContaining('matrix('),
      },
    });
  });
});
