import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Particle from './components/Particle';
import IndexContext from './contexts/IndexContext';
import * as THREE from 'three/src/Three';
import { Canvas } from 'react-three-fiber';
import { getDevice } from './helpers/UserAgent';


import * as serviceWorker from './serviceWorker';

export default function Main() {
  const ua = useMemo(() => {
    return getDevice();
  }, []);

  return (
    <>
      <Canvas
          className='canvas'
          camera={{ position: [-5, 100, 50], near: 0.1, fov: 45, up: [0,1,0], zoom:1, far: 10000, }}
          // onCreated={ ({ gl, camera }) => {
          //   gl.setClearColor(new THREE.Color("#ffffff"))
          // }}
        >
          {/* Canvasの外だとContextが取得できない */}
          <IndexContext.Provider value={ua}>
            <Particle />
          </IndexContext.Provider>
        </Canvas>
    </>
  );
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
