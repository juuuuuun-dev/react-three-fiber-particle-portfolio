import React from 'react';
import ReactDOM from 'react-dom';
import useStore from './contexts/store';
import { Contact } from "./pages/contact";
import { About } from "./pages/about";
import { Index } from "./pages/index";
// import { Switch, Route, BrowserRouter, NavLink } from "react-router-dom";

import './index.scss';

export default function Main() {
  // const canvasRef = useRef();
  // const actions = useStore(state => state.actions);
  // actions.useYScroll({ domTarget: canvasRef });
  const actions = useStore((state) => state.actions);
  window.onresize = actions.onResize;
  window.onpopstate = actions.onPopState;
  return (
    <>
      <Index />
      <About />
      <Contact />
      {/* <BrowserRouter>
        <Switch>
          <Route path="/contact/" exact component={Contact} />
        </Switch>
      </BrowserRouter> */}
      {/* <div
        ref={canvasRef}
        className='canvas'
        >
      <Canvas
          camera={{ position: [-5, 100, 50], near: 0.1, fov: 45, up: [0,1,0], zoom:1, far: 10000, }}
          // onPointerMove={actions.updateMouse}
          onCreated={ ({ gl, camera }) => {
            gl.setClearColor("white")
          }}
        >
            <Suspense fallback={null}>
              <MoveText position={[0, 4.2, 0]} />
            </Suspense>
            <Particle />
        </Canvas>
        </div> */}
        {/* <Router>
          <Switch>
            <Route path="/" exact component={Index} />
            <Route path="/contact/" exact component={Contact} />
          </Switch>
        </Router> */}
    </>
  );
}

ReactDOM.render(<Main />, document.getElementById('root'));
