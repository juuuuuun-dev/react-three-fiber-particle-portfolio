import * as THREE from 'three'
import React, { useMemo, useRef, useState } from 'react'
import { useLoader, useUpdate, useFrame } from 'react-three-fiber'

export default function({ children, vAlign = 'center', hAlign = 'center', size = 1, color = '#000000', ...props }) {
  const ref = useRef();
  const [listIndex , setListIndex] = useState(0);
  useFrame(({ clock }) => {
    // ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3
    ref.current.rotation.x = 30;
    ref.current.rotation.y = Math.PI * 0.32;
    ref.current.position.x = Math.tan(clock.elapsedTime) * 2.;
    ref.current.needsUpdate = true;
    // console.log(Math.tan(clock.elapsedTime) * 2.);
  })
  const textList = [
    { top: 'MOVING', bottom: 'FORWARD'},
    { top: 'ABOUT', bottom: 'ME'},
  ]
  // click
  const textListLen = textList.length;
  document.addEventListener('mousewheel', function() {
    console.log('mousewheel')
    // console.log(listIndex);
    // if (textListLen <= listIndex) {
    //   setListIndex(0)
    // } else {
    //   setListIndex(prevent => prevent+1)
    // }
    setListIndex(() => {
      console.log('click')
      if (textList.length <= listIndex+1) {
        return 0;
      } else {
        return listIndex+1;
      }
    },[textListLen]);
  },  {passive: true});

  return (
    <group ref={ref}>
      <Text hAlign="left" position={[12, -12, 0]} children={textList[listIndex].top} />
      <Text hAlign="left" position={[12, -18, 0]} children={textList[listIndex].bottom} />
    </group>
  )
  
  
}

function Text({ children, vAlign = 'center', hAlign = 'center', size = 1, color = '#000000', ...props }) {
  const font = useLoader(THREE.FontLoader, '/font/bold.blob')
  const config = useMemo(
    () => ({ font, size: 55, height: -0, curveSegments: 32, bevelEnabled: false, bevelThickness: 1, bevelSize: 1.5, bevelOffset: 0, bevelSegments: 1 }),
    [font]
  )
  const mesh = useUpdate(
    self => {
      const size = new THREE.Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox.getSize(size)
      self.position.x = hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x
      self.position.y = vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y
    },
    [children]
  )
  return (
    <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry needsUpdate={true} attach="geometry" args={[children, config]} />
        <meshNormalMaterial attach="material" />
      </mesh>
    </group>
  )
}
