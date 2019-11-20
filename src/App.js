import React, { useMemo } from 'react';
import './App.css';
import Particle from './components/Particle';
import { Canvas } from 'react-three-fiber';
import * as THREE from 'three/src/Three';
import AppContext from './contexts/AppContext';

function App() {
  const ua = useMemo(() => {
    return getDevice();
  }, [])
  return (
    <AppContext.Provider value={ ua }>
      <div className="App">
        <Canvas
          className='canvas'
          camera={{ position: [1, 3, 10], hear: 1, far: 10000, }}
          onCreated={ ({ gl, camera }) => {
            gl.setClearColor(new THREE.Color("#ffffff"))
          }}
        >
          <Particle />
        </Canvas>
      </div>
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

export default App;
