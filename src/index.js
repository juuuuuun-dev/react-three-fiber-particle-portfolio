import React, { useMemo, useRef, Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Particle from './components/Particle';
import MoveText from './components/MoveText';
import * as THREE from 'three/src/Three';
import { Canvas } from 'react-three-fiber';

import useStore from './contexts/store'

export default function Main() {
  const canvasRef = useRef();
  const actions = useStore(state => state.actions);
  actions.useYScroll({ domTarget: canvasRef });
  return (
    <>
      <div
        ref={canvasRef}
        className='canvas'
        >
      <Canvas
          camera={{ position: [-5, 100, 50], near: 0.1, fov: 45, up: [0,1,0], zoom:1, far: 10000, }}
          // onWheel={actions.onScroll}
          // onClick={}
          onCreated={ ({ gl, camera }) => {
            gl.setClearColor(new THREE.Color("#ffffff"))
          }}
        >
          {/* Canvasの外だとContextが取得できない */}
          <Suspense fallback={null}>
            <MoveText position={[0, 4.2, 0]} />
          </Suspense>
          <Particle />
        </Canvas>
        </div>
    </>
  );
}


ReactDOM.render(<Main />, document.getElementById('root'));
