import React from 'react';
import { shallow } from 'enzyme';
import { mat2d, vec2 } from 'gl-matrix';
import { Transform2d, MULTIPLICATION_ORDER } from '../src';

describe('<Transform2d />', () => {
  let props, Comp;

  describe('missing or incorrect props', () => {
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

    it('sets rotate to 0 when it is passed incorrectly', () => {
      props.rotate = true;

      const wrapper = shallow(
        <Transform2d {...props}>
          <div />
        </Transform2d>
      );

      const instance = wrapper.instance();

      expect(instance.matrix[0]).toBeCloseTo(2, 6);
      expect(instance.matrix[1]).toBeCloseTo(0, 6);
      expect(instance.matrix[2]).toBeCloseTo(0, 6);
      expect(instance.matrix[3]).toBeCloseTo(2, 6);
      expect(instance.matrix[4]).toBeCloseTo(10, 6);
      expect(instance.matrix[5]).toBeCloseTo(20, 6);

      expect(instance.matrixWorld[0]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[1]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[2]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[3]).toBeCloseTo(2, 6);
      expect(instance.matrixWorld[4]).toBeCloseTo(0, 6);
      expect(instance.matrixWorld[5]).toBeCloseTo(10, 6);
    });

    it('renders null when no children passed through', () => {
      const wrapper = shallow(<Transform2d {...props} />);
      expect(wrapper.get(0)).toBe(null);
    });

    it('renders null for a child which returns false', () => {
      // we're mainly testing this doesn't break rendering :)
      const wrapper = shallow(
        <Transform2d {...props}>
          <div />
          {false && <div />}
        </Transform2d>
      );

      expect(wrapper.length).toBe(1);
    });
  });

  function runSharedTests() {
    it('performs the correct matrix calculations', () => {
      const wrapper = shallow(
        <Transform2d {...props}>
          <div />
        </Transform2d>
      );
      const instance = wrapper.instance();

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
    });

    it('performs the correct calculations when passed PRE as the multiplication order', () => {
      props.multiplicationOrder = MULTIPLICATION_ORDER.PRE;

      const wrapper = shallow(
        <Transform2d {...props}>
          <div />
        </Transform2d>
      );
      const instance = wrapper.instance();

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
    });

    it('passes the correct props down to an HTML element', () => {
      const wrapper = shallow(
        <Transform2d {...props}>
          <div className="child" style={{ background: '#f00' }} />
        </Transform2d>
      );
      const child = wrapper.find('.child');
      const childProps = child.props();

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

    it('passes the correct props down to a function as a child', () => {
      const comp = jest.fn();

      const wrapper = shallow(<Transform2d {...props}>{comp}</Transform2d>);
      const instance = wrapper.instance();

      expect(comp).toHaveBeenCalledWith({
        parentMatrixWorld: instance.matrixWorld,
        multiplicationOrder: MULTIPLICATION_ORDER.POST,
        style: {
          transform: expect.stringContaining('matrix('),
        },
      });
    });
  }

  describe('props as JS objects', () => {
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

    runSharedTests();
  });

  describe('props as gl-matrix vec2s', () => {
    beforeEach(() => {
      const identity = mat2d.create();
      const parentMatrixWorld = mat2d.translate(identity, identity, vec2.fromValues(-10, -10));

      Comp = () => <div />;

      props = {
        parentMatrixWorld,
        translate: vec2.fromValues(10, 20),
        scale: vec2.fromValues(2, 2),
        rotate: Math.PI / 2,
      };
    });

    runSharedTests();
  });
});
