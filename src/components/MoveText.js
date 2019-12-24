import * as THREE from 'three'
import React, { useMemo, useRef, createRef } from 'react'
import { useLoader, useUpdate, useFrame } from 'react-three-fiber'
import useStore from '../contexts/store'

export default function({ children, vAlign = 'center', hAlign = 'center', size = 1, color = '#000000', ...props }) {
  const navListIndex = useStore(state => state.navListIndex);
  const navList = useStore(state => state.navList);
  const coefficient = useStore(state => state.coefficient);
  const targetCoefficient = useStore(state => state.targetCoefficient);
  const actions = useStore(state => state.actions);

  const refs = useRef(navList.map(() => createRef()));
  // let coefficient = 0.6;
  // const targetCoefficient = 0.1;
  useFrame(() => {
    actions.setCoefficient(coefficient + (targetCoefficient - coefficient) * .1);
    // coefficient += (targetCoefficient - coefficient) * .1;
    // ref.current.rotation.x = 30;
    // ref.current.rotation.y = Math.PI * 0.28;
    // ref.current.position.x = Math.tan(coefficient) * 10.;
    // ref.current.needsUpdate = true;

    navList.map((item, index) => {
      refs.current[index].current.rotation.x = 30;
      refs.current[index].current.rotation.y = Math.PI * 0.28;
      if (index === navListIndex) {
        refs.current[navListIndex].current.position.x = Math.tan(coefficient) * 10.;
      } else {
        refs.current[index].current.position.x = 100;
      }
      // refs.current[index].current.position.x = Math.tan(coefficient) * 10. * ((navListIndex * 20) - index);
      refs.current[navListIndex].current.position.x = Math.tan(coefficient) * 10.;
      refs.current[index].current.needsUpdate = true;
    })
  });

  return (
    <>
    {navList.map((item, index) => {
      return (
        <group ref={refs.current[index]} key={index}>
          <Text hAlign="left" position={[-5, -10, 20]} children={navList[index].topText} />
          <Text hAlign="left" position={[-5, -15, 20]} children={navList[index].bottomText} /> 
        </group>
      )
    })}
    </>
  )
}

function Text({ children, vAlign = 'center', hAlign = 'center', size = 1, color = '#000000', ...props }) {
  const font = useLoader(THREE.FontLoader, '/font/bold.blob')
  const config = useMemo(
    () => ({ font, size: 45, height: -0, curveSegments: 32, bevelEnabled: false, bevelThickness: 1, bevelSize: 1.5, bevelOffset: 0, bevelSegments: 1 }),
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
        <meshBasicMaterial transparent={true} color={new THREE.Color('#404ca6')} attach="material" />
      </mesh>
    </group>
  )
}
