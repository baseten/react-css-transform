[![npm version](https://badge.fury.io/js/react-css-transform.svg)](https://badge.fury.io/js/react-css-transform)
![dependencies](https://david-dm.org/baseten/react-css-transform.svg)
![travis build](https://travis-ci.com/baseten/react-css-transform.svg?branch=master)
[![codecov](https://codecov.io/gh/baseten/react-css-transform/branch/master/graph/badge.svg)](https://codecov.io/gh/baseten/react-css-transform)

# React CSS Transform

A React helper library to handle nested 2D and 3D CSS transforms using matrix multiplication, 
drastically reducing the number of nested DOM elements required and making complex 
combinations of nested transformations trivial.

`<Transform2d>` was initially developed while I was working at [Pest Pulse](https://www.pestpulse.com/) 
for a zoomable/pannable map with markers.

## Install

`react-css-transform` uses the [gl-matrix library](https://github.com/toji/gl-matrix)
under the hood. It's a peer dependency so install like so:

`npm install gl-matrix react-css-transform --save`

## Why

While it might be a little niche, there have been several projects over the last few years
where I've thought about writing this and ended up going with a "faster", hackier
solution using nested divs and manual inline calculations. Often the nested divs caused
me problems with mouse and UI events. I thought I'd do it properly this time and thanks to
Pest Pulse for letting me open source it.

If you're just doing basic transforms on a single element, you probably don't need this 
library. It is super useful for doing nested transformations and it can be useful on a 
single element if you want to ensure consistent application of the transform, scale and 
rotate transformations. If you hadn't noticed the order is important!

## Examples

[3D Cubes Example](https://baseten.github.io/react-css-transform/3d-cubes/index.html)

![3D Cubes GIF](https://baseten.github.io/react-css-transform/3d-cubes.gif)

## Usage

In general it is best to make sure that the HTML elements you are transforming have styles
set like so:

```css
position: absolute;
left: 0;
top: 0;
```

If you are using 3D Transforms you also most likely want to set the containing HTML Element 
to have `preserve-3d` and some `perspective`:

```css
transform-style: preserve-3d;
perspective: 500px;
```

### &lt;Transform2d />

The styles provided to the `<div />` below will be merged with the computed CSS `matrix` transform

```javascript
<Transform2d translate={{x:10, y:20}} scale={2} rotate={Math.PI} />
  <Transform2d translate={{x: -50, y:-50}}>
    // ... as much nesting as you like
    <div style={{width: 100, height: 100, margin: -50, background: '#f00'}} />
  </Transform2d>
</Transform2d> 
```

#### Props

##### - multiplicationOrder

**Optional**. An enum: either `MULTIPLICATION_ORDER.PRE` or `MULTIPLICATION_ORDER.POST`.
This determines the order an object's local matrix is multiplied with it's parent's matrix world.
The default is `MULTIPLICATION_ORDER.POST`. You can only set this at the most outer `Transform2d`
component. `PRE` will mimic how the transforms would be applied if you were doing them as
actual nested DOM elements. `POST` is much more natural mathematically and way more useful.
You should use `POST` :)

##### - translate

**Optional**. An object describing translation. Either a plain JS object or a gl-matrix 
`vec2`. If you pass in a JS object without all dimensions, missing dimensions will be 
given `0` as the default value. If nothing is supplied no translation occurs.

##### - scale

**Optional**. The transform's scale. either a number, a plain JS object or a gl-matrix 
`vec2`. A number will apply the same scale to `x` and `y`. If you pass in a JS object 
without all dimensions, missing dimensions will be given `1` as the default value. If
nothing is supplied no scaling occurs. 

##### - rotate

**Optional**. The transform's rotation. A number provided in **radians**. If nothing is 
supplied no rotation occurs.

### &lt;Transform3d />

The styles provided to the `<div />` below will be merged with the CSS `matrix3d` transform

```javascript
const translateToCentre = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

const theta = Math.PI / 2;
const yAxis = { x: 0, y: 1, z: 0 };
const zAxis = { x: 0, y: 0, z: 1 };

<Transform3d translate={translateToCentre} rotate={theta} rotateAxis={yAxis}>
  <Transform3d rotate={theta} rotateAxis={zAxis}>
    // ... as much nesting as you like
    <div style={{width: 100, height: 100, margin: -50, background: '#f00'}} />
  </Transform3d>
<Transform3d translate={cubeGroup1Translate}>
```

#### Props

##### - multiplicationOrder

**Optional**. An enum: either `MULTIPLICATION_ORDER.PRE` or `MULTIPLICATION_ORDER.POST`.
This determines the order an object's local matrix is multiplied with it's parent's matrix world.
The default is `MULTIPLICATION_ORDER.POST`. You can only set this at the most outer `Transform2d`
component. `PRE` will mimic how the transforms would be applied if you were doing them as
actual nested DOM elements. `POST` is much more natural mathematically and way more useful.
You should use `POST` :)

##### - translate

**Optional**. An object describing translation. Either a plain JS object or a gl-matrix 
`vec3`. If you pass in a JS object without all dimensions, missing dimensions will be 
given `0` as the default value. If nothing is supplied no translation occurs.

##### - scale

**Optional**. The transform's scale. either a number, a plain JS object or a gl-matrix 
`vec3`. A number will apply the same scale to `x`, `y` and `z`. If you pass in a JS object 
without all dimensions, missing dimensions will be given `1` as the default value. If
nothing is supplied no scaling occurs. 

##### - rotate

**Optional**. The transform's rotation. A number provided in **radians**. If nothing is 
supplied no rotation occurs.

##### - rotateAxis

**Optional**. The axis to rotate around. Either a plain JS object or a gl-matrix `vec3`.
It can be any arbitrary axis, but it must be normalized (a unit vector). If nothing is 
supplied it defaults to the z-axis: `{x: 0, y: 0, z: 1}`. 

## Gotchas

### 2D and 3D Transforms together

Make sure you don't mix `Transform2d` and `Transform3d` components together! You can use
`Transform3d` almost in exactly the same way as `Transform2d` if you want to force a 3D 
CSS transform, or combine with other `Transform3d`s. The only caveat here is it's better
to pass scale in as an object rather than a number (otherwise z will be scaled too).
`Transform3d` sets the default `rotateAxis` as the z axis, so it will rotate like a
`Transform2d`:

`<Transform3d translate={{x:10, y:10}} scale={{x:2, y:2}} rotate={Math.PI} />`

### Performance

The library is generally very performant, mainly as it leverages the brilliant `gl-matrix`
library and obviously React's virtual DOM. There are a couple of issues it's worth being
aware of though. These are mainly applicable when doing 3D transformations and/or when
calling `render` in a `requestAnimationFrame` callback:

* When running in development mode, `propTypes` checking can cause performance bottlenecks.
Chrome seems to suffer from this more than Firefox and Safari. If you're seeing 
performance issues, try running a production build first before going down any other 
rabbit holes.

* With standard React apps you've probably got used to declaring lambdas and object literals
inline in your render method. For standard UI where renders are normally limited to user 
interaction, you most likely won't notice a performance hit doing this. If you're gonna do 
3D transformations or just a complex `render` every frame, you *may* want to reconsider 
this. Modern browsers can create and dispose of objects and arrays very quickly, but when 
they're disposed of the garbage collector *may* cause a janky animation. As with all 
performance optimization don't do it unless you need to. Just sayin' :) 

### IE10 and IE11

IE10 and IE11 famously don't support `preserve-3d`. To a certain extent this library can
help with issues here because it doesn't create any nested DOM elements, but computes 
matrices to use on a single set of children. However, you will still very likely run into 
z order issues as IE will maintain DOM / z-index order over 3D z position. This 
restriction makes doing complex 3D transformations in these browsers impossible. 
Ultimately it depends on your use case and whether you have to support them.

## How it works

Under the hood `Transform2d` and `Transform3d` work in pretty much exactly the same way.
The `gl-matrix` library is used to handle all the vector and matrix maths, calculating
an object's local matrix based on the supplied props (`translate`, `scale`, `rotate` and 
for `Transform3d` `rotateAxis`). These are multiplied together in the standard `T * R * S`
order. This local matrix is multiplied with the `parentMatrixWorld` (which is automatically
passed down from any parent Transforms) to produce the object's `matrixWorld`. This 
`matrixWorld` can then be used in an HTML element's [CSS transform property](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix), either as
`matrix` or `matrix3d` depending on the transform. The `matrixWorld` is then passed down
to any nested Transforms as the next `parentMatrixWorld`.

`Transform2d` and `Transform3d` handle passing down these props internally as well as 
setting the `style` property (while merging in any predefined styles) on their child HTML 
elements. But if you need to add any custom React Components in between them and the HTML
element you wish to transform, you will need to manually pass the props through, as you 
can see [here](https://github.com/baseten/react-css-transform/blob/master/examples/3d-cubes/src/components/CubeGroup.js), 
