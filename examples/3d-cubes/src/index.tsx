import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import { Transform3d, useFactoryRef } from 'react-css-transform';
import { vec3 } from 'gl-matrix';
import { CubeGroup } from './components/CubeGroup';
import {
  DimensionsProvider,
  useDimensionsContext,
} from './components/DimensionsContext';
import { yAxis, zAxis } from './constants';

import './styles.css';

const frameTime = 1000 / 60;

const BaseApp = () => {
  const { width, height, perspective } = useDimensionsContext();
  const appStyle = useMemo(
    () => ({
      perspective,
    }),
    [perspective],
  );

  const [playing, setPlaying] = useState(true);
  const togglePlaying = useCallback(() => {
    setPlaying((isPlaying) => !isPlaying);
  }, []);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        togglePlaying();
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []);

  useEffect(() => {
    const update = () => {
      if (!playing) {
        return;
      }

      setTime(performance.now());
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [playing]);

  const [time, setTime] = useState(() => performance.now());

  const translateToCentre = useFactoryRef<vec3>(() => vec3.create());
  const cubeGroup1Translate = useFactoryRef<vec3>(() => vec3.create());
  const cubeGroup2Translate = useFactoryRef<vec3>(() => vec3.create());

  const theta = (time / frameTime) * 0.04;

  vec3.set(translateToCentre.current, width / 2, height / 2, -400);

  const cubeFaceSize = (110 / 750) * height;
  const cubeGroupSpacing = cubeFaceSize * 2.25;

  vec3.set(cubeGroup1Translate.current, cubeGroupSpacing, 0, 0);
  vec3.set(cubeGroup2Translate.current, -cubeGroupSpacing, 0, 0);

  return (
    <div className="app" style={appStyle}>
      <Transform3d
        translate={translateToCentre.current}
        rotate={theta}
        rotateAxis={yAxis}
      >
        <Transform3d rotate={theta} rotateAxis={zAxis}>
          <Transform3d translate={cubeGroup1Translate.current}>
            <CubeGroup cubeFaceSize={cubeFaceSize} time={time} />
          </Transform3d>
          <Transform3d translate={cubeGroup2Translate.current}>
            <CubeGroup cubeFaceSize={cubeFaceSize} time={time} />
          </Transform3d>
        </Transform3d>
      </Transform3d>
    </div>
  );
};

const App = () => {
  return (
    <DimensionsProvider>
      <BaseApp />
    </DimensionsProvider>
  );
};

const rootElement = document.getElementById('root');

const root = createRoot(rootElement!);
root.render(<App />);
