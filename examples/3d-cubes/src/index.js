import React from 'react';
import ReactDOM from 'react-dom';
import { Transform3d } from 'react-css-transform';
import { CubeGroup } from './components/CubeGroup';
import { yAxis, zAxis } from './constants';

import './styles.css';

class App extends React.Component {
  state = {
    time: performance.now(),
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    playing: true,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keyup', this.handleKeyUp);

    this.play();
  }

  componentDidUpdate(prevProps, prevState) {
    const { playing } = this.state;

    if (!prevState.playing && playing) {
      this.play();
    }
  }

  render() {
    const { time, windowWidth, windowHeight } = this.state;
    const frameTime = 1000 / 60;
    const theta = (time / frameTime) * 0.04;

    const translateToCentre = {
      x: windowWidth / 2,
      y: windowHeight / 2,
      z: -400,
    };

    const cubeFaceSize = (110 / 750) * windowHeight;
    const cubeGroupSpacing = cubeFaceSize * 2.25;
    const appStyle = {
      perspective: (500 / 750) * windowHeight,
    };

    return (
      <div className="app" style={appStyle}>
        <Transform3d translate={translateToCentre} rotate={theta} rotateAxis={yAxis}>
          <Transform3d rotate={theta} rotateAxis={zAxis}>
            <Transform3d translate={{ x: cubeGroupSpacing }}>
              <CubeGroup cubeFaceSize={cubeFaceSize} time={time} />
            </Transform3d>
            <Transform3d translate={{ x: -cubeGroupSpacing }}>
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
