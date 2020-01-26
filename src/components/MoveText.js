import * as THREE from 'three'
import React, { useMemo, useRef, createRef, useState } from 'react'
import { useLoader, useUpdate, useFrame } from 'react-three-fiber'
import useStore from '../contexts/store'
import { useSpring, config } from 'react-spring'
// import{ HoverTextShader } from '../shaders/HoverTextShader'


// @todo scroll で unhover
export default function({ children, vAlign = 'center', hAlign = 'left', size = 1, color = '#000000', ...props }) {
  const navListIndex = useStore(state => state.navListIndex);
  const navList = useStore(state => state.navList);
  const navListLength = useStore(state => state.navListLength);
  const coefficient = useStore(state => state.coefficient);

  const targetCoefficient = useStore(state => state.targetCoefficient);
  const actions = useStore(state => state.actions);
  const refs = useRef(navList.map(() => createRef()));
  const [hovered, setHoverd] = useState(false);
  const canvasElem = document.getElementById('main');
  // let coefficient = 0.6;
  // const targetCoefficient = 0.1;
  

  // actions.setScrollCollbacks(scrollCollback);

  useFrame(() => {
    actions.setCoefficient(coefficient + (targetCoefficient - coefficient) * .1);
    // coefficient += (targetCoefficient - coefficient) * .1;
    // text
    for (let i = 0; navListLength > i; i++) {
      refs.current[i].current.rotation.x = 30;
      refs.current[i].current.rotation.y = Math.PI * 0.28;
      if (i === navListIndex) {
        refs.current[navListIndex].current.position.x = Math.tan(coefficient) * 10.;
      } else {
        refs.current[i].current.position.x = 100;
      }
      refs.current[navListIndex].current.position.x = Math.tan(coefficient) * 10.;
      refs.current[i].current.needsUpdate = true;
    }
    refs.current[navListIndex].current.position.y = scale.value * 20;
  });
  const { scale } = useSpring({ scale: hovered ? 1.4 : 1, config: config.stiff })

  const hover = (e) => {
    if (navList[navListIndex].path) {
      setHoverd(true);
      canvasElem.style.cursor = 'pointer';
    }
  }
  const unhover = () => {
    setHoverd(false);
    canvasElem.style.cursor = 'default';
  }
  
  const hadleClick = () => {
    // history.push('/contact');
    // actions.toggleContact();
    if (navList[navListIndex].path) {
      actions.toggleContents(navList[navListIndex].path);
    }
  }

  return (
    <>
    {navList.map((_item, index) => {
      return (
        //
        <mesh ref={refs.current[index]} key={index} onPointerOver={hover} onPointerOut={unhover}>
          <Text hAlign={hAlign} vAlign={vAlign} position={[-9, -9, 18]} children={navList[index].topText} />
          <Text hAlign={hAlign} vAlign={vAlign} position={[-9, -13, 18]} children={navList[index].bottomText} />
          <HitArea onClick={hadleClick} item={navList[index]} hAlign={hAlign} vAlign={vAlign} position={[-9, -9.5, 17]} children={navList[index].topText} />
        </mesh>
      )
    })}
    </>
  )
}

// htmlの当たり判定っぽくするため
const HitArea = ({ item, children, vAlign, hAlign, size = 1, color = '#000000', ...props }) => {
  // 文字数によりsizeを設定
  const xSclae = Math.max(item.topText.length, item.bottomText.length) * 3.6;
  const mesh = useUpdate(
    self => {
      const size = new THREE.Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox.getSize(size);
      self.position.x = hAlign === 'center' ? -size.x / 3 : hAlign === 'right' ? 0 : -size.x / 2.4
      self.position.y = vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y
    },
    [children]
  )
  return (
    <group {...props}>
      <mesh ref={mesh}>
        <planeBufferGeometry attach="geometry" args={[xSclae, 8]} />
        <meshBasicMaterial opacity={0.0} color="black" attach="material" transparent={true} />
      </mesh>
    </group>
    )
}

function Text({ children, vAlign, hAlign, size = 1, color = '#ffffff', ...props }) {
  const font = useLoader(THREE.FontLoader, '/font/bold.blob')
  const textConfig = useMemo(
    () => ({ font, size: 38, height: -0, curveSegments: 32, bevelEnabled: false, bevelThickness: .0, bevelSize: .0, bevelOffset: 0, bevelSegments: 1 }),
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
        <textGeometry needsUpdate={true} attach="geometry" args={[children, textConfig]} />
        <meshLambertMaterial transparent={true} color={new THREE.Color(color)} attach="material" />
      </mesh>
    </group>
  )
}
