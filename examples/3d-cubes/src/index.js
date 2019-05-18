import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Transform3d } from 'react-css-transform';
import { vec3 } from 'gl-matrix';
import { CubeGroup } from './components/CubeGroup';
import { yAxis, zAxis } from './constants';

import './styles.css';

class App extends React.Component {
  state = {
    time: performance.now(),
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    playing: true,
    appStyle: {
      perspective: 500,
    },
  };

  translateToCentre = vec3.create();
  cubeGroup1Translate = vec3.create();
  cubeGroup2Translate = vec3.create();

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keyup', this.handleKeyUp);

    this.handleResize();
    this.play();
  }

  componentDidUpdate(prevProps, prevState) {
    const { playing } = this.state;

    if (!prevState.playing && playing) {
      this.play();
    }
  }

  render() {
    const { time, windowWidth, windowHeight, appStyle } = this.state;
    const { translateToCentre, cubeGroup1Translate, cubeGroup2Translate } = this;
    const frameTime = 1000 / 60;
    const theta = (time / frameTime) * 0.04;

    vec3.set(translateToCentre, windowWidth / 2, windowHeight / 2, -400);

    const cubeFaceSize = (110 / 750) * windowHeight;
    const cubeGroupSpacing = cubeFaceSize * 2.25;

    vec3.set(cubeGroup1Translate, cubeGroupSpacing, 0, 0);
    vec3.set(cubeGroup2Translate, -cubeGroupSpacing, 0, 0);

    return (
      <div className="app" style={appStyle}>
        <Transform3d translate={translateToCentre} rotate={theta} rotateAxis={yAxis}>
          <Transform3d rotate={theta} rotateAxis={zAxis}>
            <Transform3d translate={cubeGroup1Translate}>
              <CubeGroup cubeFaceSize={cubeFaceSize} time={time} />
            </Transform3d>
            <Transform3d translate={cubeGroup2Translate}>
              <CubeGroup cubeFaceSize={cubeFaceSize} time={time} />
            </Transform3d>
          </Transform3d>
        </Transform3d>
      </div>
    );
  }

  handleKeyUp = e => {
    if (e.keyCode === 32) {
      this.setState(state => ({
        ...state,
        playing: !state.playing,
      }));
    }
  };

  handleResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      appStyle: {
        perspective: (500 / 750) * window.innerHeight,
      },
    });
  };

  play() {
    requestAnimationFrame(this.update);
  }

  update = () => {
    const { playing } = this.state;

    if (playing) {
      requestAnimationFrame(this.update);
    }

    this.setState({
      time: performance.now(),
    });
  };
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
