import React from "react";
import Particle from "../components/Particle";
import MoveText from "../components/MoveText";
import { Canvas } from "react-three-fiber";
import useStore from "../contexts/store";
import polyfill from '@juggle/resize-observer'
import * as THREE from 'three'
// import variables from '../scss/_variables.scss'

export function Main() {
  // const primaryColor = variables.primaryColor;
  const canvasRef = React.useRef();
  const actions = useStore(state => state.actions);
  actions.useYScroll({ domTarget: canvasRef });
  return (
    <>
      <div ref={canvasRef} className="canvas" id="main">
        <Canvas
          resize={{polyfill}}
          camera={{ position: [-5, 100, 50], near: 0.1, fov: 45, up: [0, 1, 0], zoom: 1, far: 10000 }}
          onCreated={ ({ gl }) => {
            // gl.setClearColor("#363b4e")
            // gl.setClearColor(new THREE.Color(primaryColor))
          }}
        >
          <pointLight distance={200} intensity={8} position={[40, 129, 0.0]} color={new THREE.Color(.5, .5, .23)} />

          {/* <spotLight intensity={1.2} color="white" penumbra={1.5} position={[20, 70, 0.0]} /> */}
          {/* <ambientLight color="white" intensity={0.9} /> */}
          <React.Suspense fallback={ null }>
            <MoveText position={ [0, 4.2, 0] } />
          </React.Suspense>
          <Particle />
        </Canvas>
      </div>
    </>
  );
}