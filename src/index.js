import React, { useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Particle from './components/Particle';
import AppContext from './contexts/AppContext';
import * as THREE from 'three/src/Three';
import { Canvas } from 'react-three-fiber';

import * as serviceWorker from './serviceWorker';

export default function Main() {
  const ua = useMemo(() => {
    return getDevice();
  }, []);

  return (
    <AppContext.Provider value={{ ua }}>
      <Canvas
          className='canvas'
          camera={{ position: [-5, 100, 250], near: 0.1, fov: 45, up: [0,1,0], zoom:1, far: 10000, }}
          onCreated={ ({ gl, camera }) => {
            gl.setClearColor(new THREE.Color("#ffffff"))
          }}
        >
          <Particle />
        </Canvas>
    </AppContext.Provider>
  );
}

/**
 * ua
 * とりあえずここで
 */
const getDevice = () => {
  const ua = navigator.userAgent;
  if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
    return 'sp';
  }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
      return 'tablet';
  }else{
      return 'pc';
  }
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
