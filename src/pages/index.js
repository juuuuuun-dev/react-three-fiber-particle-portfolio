import React from "react";
import Particle from "../components/Particle";
import MoveText from "../components/MoveText";
import { Canvas } from "react-three-fiber";
import useStore from "../contexts/store";

export function Index() {
  // const history = useHistory();
  const canvasRef = React.useRef();
  const actions = useStore(state => state.actions);
  actions.useYScroll({ domTarget: canvasRef });
  return (
    <>
      <div ref={canvasRef} className="canvas" id="main">
        <Canvas
          camera={{ position: [-5, 100, 50], near: 0.1, fov: 45, up: [0, 1, 0], zoom: 1, far: 10000 }}
          onCreated={ ({ gl }) => {
            gl.setClearColor("#43465a")
          }}
        >
          <React.Suspense fallback={ null }>
            <MoveText position={ [0, 4.2, 0] } />
          </React.Suspense>
          <Particle />
        </Canvas>
      </div>
    </>
  );
}