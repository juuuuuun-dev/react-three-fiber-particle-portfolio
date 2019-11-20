import React from 'react';
import './App.css';
import Particle from './components/Particle';
import { Canvas } from 'react-three-fiber';
import * as THREE from 'three/src/Three'

function App() {
  return (
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
  );
}

export default App;
