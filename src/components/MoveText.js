import * as THREE from 'three'
import React, { useMemo, useRef, createRef, forwardRef, useState } from 'react'
import { useLoader, useUpdate, useFrame } from 'react-three-fiber'
import useStore from '../contexts/store'
import { useSpring } from 'react-spring'

export default function ({ children, vAlign = 'center', hAlign = 'left', ...props }) {
  const navListIndex = useStore(state => state.navListIndex);
  const prevNavListIndex = useStore(state => state.prevNavListIndex);
  const navList = useStore(state => state.navList);
  const navListLength = useStore(state => state.navListLength);
  const coefficient = useStore(state => state.coefficient);

  const targetCoefficient = useStore(state => state.targetCoefficient);
  const actions = useStore(state => state.actions);
  const refs = useRef(navList.map(() => createRef()));
  const revRefs = useRef(navList.map(() => createRef()));
  const [hovered, setHoverd] = useState(false);
  const canvasElem = document.getElementById('main');

  // default value
  const color = '#ffffff';
  const hoveredScale = 1.3;
  const defaultSize = 6.3;
  const defaultPositionX = -10;
  const defaultBottomY = -15;
  const defaultLineHeight = 4.2;
  const defaultLotationY = 0.90;
  // actions.setScrollCollbacks(scrollCollback);

  useFrame(() => {
    actions.setCoefficient(coefficient + (targetCoefficient - coefficient) * .06);
    // coefficient += (targetCoefficient - coefficient) * .1;

    for (let i = 0; navListLength > i; i++) {
      // @todo ここでrefのroop必要
      // revRefs.current[i].current.rotation.x = 60;
      if (revRefs.current[i].current) {
        revRefs.current[i].current.rotation.x = 10;
      }
      refs.current[i].current.rotation.x = 30;
      refs.current[i].current.rotation.y = Math.PI * 0.28;
      const x = Math.tan(coefficient) * 10.;
      if (i === navListIndex) {
        if (x > 0) {
          refs.current[navListIndex].current.position.x = x;
        } else {
          refs.current[prevNavListIndex].current.position.x = x;
        }
      } else if (i === prevNavListIndex && x < 0) {
        refs.current[prevNavListIndex].current.position.x = x;
      } else {
        refs.current[i].current.position.x = 200;
      }
      refs.current[i].current.needsUpdate = true;
    }
    refs.current[navListIndex].current.position.y = scale.value * 20;
    refs.current[navListIndex].current.rotation.y = rotationY.value;
  });
  const { scale, rotationY } = useSpring({
    scale: hovered ? hoveredScale : 1,
    rotationY: hovered ? 0.80 : navList[navListIndex].lotationY || defaultLotationY,
  })
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
    if (navList[navListIndex].path) {
      actions.toggleContents(navList[navListIndex].path);
    }
  }

  return (
    <>
      {navList.map((item, index) => {
        const bottom = item.bottomY || defaultBottomY;
        const positionX = item.positionX || defaultPositionX;
        const reverseX = positionX * 2;
        return (
          <>
            <mesh ref={refs.current[index]} key={index + '_mesh'} onPointerOver={hover} onPointerOut={unhover}>
              {// @todo 多分これをもう一個
                item.texts.map((textValue, textIndex) => {
                  const len = navList[index].texts.length;
                  const textLineHeight = item.lineHeight || defaultLineHeight;
                  const size = navList[index].textSize || defaultSize;
                  let n = 1 + textIndex;
                  let lineHeight;
                  lineHeight = bottom + (len * textLineHeight) - (n * textLineHeight);
                  const reverseHeight = lineHeight - (len * textLineHeight);
                  return (
                    <mesh key={textIndex} ref={revRefs.current[index]}>
                      <Text size={size} hAlign={hAlign} vAlign={vAlign} position={[positionX, lineHeight, 18]} color={color} children={textValue} />
                      <Text size={size} hAlign={hAlign} vAlign={vAlign} position={[positionX, reverseHeight, 18]} color={color} children={textValue} />
                    </mesh>
                  )
                })
              }
              {item.path && <HitArea onClick={hadleClick} item={navList[index]} hAlign={hAlign} vAlign={vAlign} lineHeight={defaultLineHeight} position={[-9, -9.5, 17]} children={navList[index].topText} />}
              }
          </mesh>
            <mesh ref={revRefs.current[index]} key={index + '_mesh'} onPointerOver={hover} onPointerOut={unhover}>
              {// @todo 多分これをもう一個
                item.texts.map((textValue, textIndex) => {
                  const len = navList[index].texts.length;
                  const textLineHeight = item.lineHeight || defaultLineHeight;
                  const size = navList[index].textSize || defaultSize;
                  let n = 1 + textIndex;
                  let lineHeight;
                  lineHeight = bottom + (len * textLineHeight) - (n * textLineHeight);
                  const reverseHeight = lineHeight - (len * textLineHeight);
                  return (
                    <Text size={size} hAlign={hAlign} vAlign={vAlign} position={[positionX, reverseHeight, 18]} color={color} children={textValue} />
                  )
                })
              }
              }
          </mesh>
          </>
        )
      })}
    </>
  )
}

let Text = ({ children, vAlign, hAlign, size, key, color, ...props }, textRef) => {
  const font = useLoader(THREE.FontLoader, '/font/FuturaT_Bold.json')
  const textConfig = useMemo(
    () => ({ font, size: size, height: -0, curveSegments: 32, bevelEnabled: false, bevelThickness: .0, bevelSize: .0, bevelOffset: 0, bevelSegments: 1 }),
    [size, font]
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
    <group ref={textRef} {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry needsUpdate={true} attach="geometry" args={[children, textConfig]} />
        <meshLambertMaterial transparent={true} color={new THREE.Color(color)} attach="material" />
      </mesh>
    </group>
  )
}

Text = forwardRef(Text);
// like html link
const HitArea = ({ item, vAlign, hAlign, lineHeight, ...props }) => {
  const singleXScale = 3.5;
  const xScale = getMaxTextLength(item.texts) * singleXScale;
  const yScale = lineHeight * item.texts.length;
  const mesh = useUpdate(
    self => {
      const size = new THREE.Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox.getSize(size);
      self.position.x = hAlign === 'center' ? -size.x / 3 : hAlign === 'right' ? 0 : -size.x / 2.2
      self.position.y = vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y
    },
  )
  return (
    <group {...props}>
      <mesh ref={mesh}>
        <planeBufferGeometry attach="geometry" args={[xScale, yScale]} />
        <meshBasicMaterial opacity={0.0} color="black" attach="material" transparent={true} />
      </mesh>
    </group>
  )
}

const getMaxTextLength = (arr) => {
  const arrLen = arr.length;
  const strLenArr = [];
  for (let i = 0; arrLen > i; i++) {
    strLenArr.push(arr[i].length);
  }
  return Math.max.apply(null, strLenArr);
}
