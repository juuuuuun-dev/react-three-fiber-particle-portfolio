import React, { useMemo, Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Particle from './components/Particle';
import MoveText from './components/MoveText';
import IndexContext from './contexts/IndexContext';
import * as THREE from 'three/src/Three';
import { Canvas } from 'react-three-fiber';
import { getDevice } from './helpers/UserAgent';

// import * as serviceWorker from './serviceWorker';
// @todo zustand
let isScroll = false;
let listIndex = 0;
const listLength = 3;
export default function Main() {
  const ua = useMemo(() => {
    return getDevice();
  }, []);
  let isScroll = false;

  return (
    <>
      <Canvas
          className='canvas'
          camera={{ position: [-5, 100, 50], near: 0.1, fov: 45, up: [0,1,0], zoom:1, far: 10000, }}
          onWheel={onScroll}
          onCreated={ ({ gl, camera }) => {
            gl.setClearColor(new THREE.Color("#ffffff"))
          }}
        >
          {/* Canvasの外だとContextが取得できない */}
          <IndexContext.Provider value={{ua, listIndex}}>
            <Suspense fallback={null}>
              <MoveText position={[0, 4.2, 0]} />
            </Suspense>
            <Particle />
          </IndexContext.Provider>
        </Canvas>
    </>
  );
}

// @todo add listIndex
function onScroll(e) {
  if (isScroll) return;
  const deltaY = e.deltaY;
  isScroll = true;

  if (deltaY < 0) {
    listIndex -= 1;
    if (listIndex < 0) {
      listIndex += listLength;
    }
  } else {
    listIndex = (listIndex + 1) % listLength;
  }
  console.log(listIndex);
  setTimeout(() => {
    isScroll = false;
  }, 500);
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
