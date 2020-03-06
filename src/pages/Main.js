import React from 'react';
import { Particle } from '../components/Particle';
import MoveText from '../components/texts/MoveTexts';
import { Canvas, Dom } from 'react-three-fiber';
import useStore from '../contexts/store';
import * as THREE from 'three';

const Main = () => {

  const canvasRef = React.useRef();
  const actions = useStore(state => state.actions);
  const homeText = useStore(state => state.homeText);
  actions.useYScroll({ domTarget: canvasRef });
  return (
    <>
      <div ref={canvasRef} className='canvas' id='main'>
        <Canvas
          data-testid='canvas'
          // resize={{ polyfill }}
          camera={{
            position: [-5, 100, 50],
            near: 0.1,
            fov: 45,
            up: [0, 1, 0],
            zoom: 1,
            far: 10000
          }}
        >
          <Dom position={[100, 0, 100]}>
            <h1 data-testid="home-text">{homeText}</h1>
          </Dom>
          <pointLight
            distance={200}
            intensity={8}
            position={[40, 129, 0.0]}
            color={new THREE.Color(0.5, 0.5, 0.23)}
          />
          <React.Suspense fallback={null}>
            <MoveText />
          </React.Suspense>
          <Particle />
        </Canvas>
      </div>
    </>
  );
};

export default Main;
