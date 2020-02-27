import * as THREE from 'three';
import React, { useMemo, useRef, createRef } from 'react';
import { useLoader, useUpdate, useFrame } from 'react-three-fiber';
import useStore from '../contexts/store';

export default function({
  children,
  vAlign = 'center',
  hAlign = 'left',
  ...props
}) {
  let navListIndex = 0;
  let prevNavListIndex = navListIndex;
  const navList = useStore(state => state.navList);
  const navListLength = useStore(state => state.navListLength);
  const actions = useStore(state => state.actions);
  const refs = useRef(navList.map(() => createRef()));
  const canvasElem = document.getElementById('main');
  let hovered = false;
  // default value
  const color = '#ffffff';
  const hoveredScale = 1.2;
  const defaultSize = 6.3;
  const defaultPositionX = -10;
  const defaultBottomY = -15;
  const defaultLineHeight = 4.2;
  const defaultLotationY = 0.9;
  const targetCoefficient = 0.1;
  let coefficient = 0.3;
  let hoverScaleCoefficient = 1.0;
  let hoverLotationY = navList[navListIndex].lotationY || defaultLotationY;
  const hovertargetCoefficient = 0.8;
  // not to rerender
  const scrollCollback = index => {
    hovered = false;
    prevNavListIndex = navListIndex;
    coefficient = 3.0;
    navListIndex = index;
  };
  actions.setScrollCollbacks(scrollCollback);

  useFrame(() => {
    coefficient += (targetCoefficient - coefficient) * 0.06;
    for (let i = 0; navListLength > i; i++) {
      refs.current[i].current.rotation.x = 30;
      refs.current[i].current.rotation.y = Math.PI * 0.28;
      const x = Math.tan(coefficient) * 10;
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

    if (hovered && hoveredScale >= hoverScaleCoefficient) {
      hoverScaleCoefficient +=
        (targetCoefficient + hoverScaleCoefficient) * 0.03;
      if (navList[navListIndex].lotationY) {
        hoverLotationY = navList[navListIndex].lotationY;
      } else {
        hoverLotationY += (0.58 - hoverLotationY) * 0.03;
      }
    } else if (!hovered) {
      hoverScaleCoefficient +=
        (hovertargetCoefficient - hoverScaleCoefficient) * 0.06;
      if (navList[navListIndex].lotationY) {
        hoverLotationY = navList[navListIndex].lotationY;
      } else {
        hoverLotationY += (0.88 - hoverLotationY) * 0.06;
      }
    }

    refs.current[navListIndex].current.position.y = hoverScaleCoefficient * 20;
    refs.current[navListIndex].current.rotation.y = hoverLotationY;
  });

  const hover = e => {
    if (navList[navListIndex].path) {
      hovered = true;
      canvasElem.style.cursor = 'pointer';
    }
  };
  const unhover = () => {
    hovered = false;
    canvasElem.style.cursor = 'default';
  };
  const hadleClick = () => {
    if (navList[navListIndex].path) {
      actions.toggleContents(navList[navListIndex].path);
    }
  };

  return (
    <>
      {navList.map((item, index) => {
        const bottom = item.bottomY || defaultBottomY;
        const positionX = item.positionX || defaultPositionX;
        return (
          <mesh
            ref={refs.current[index]}
            key={index}
            onPointerOver={hover}
            onPointerOut={unhover}
          >
            {item.texts.map((textValue, textIndex) => {
              const len = navList[index].texts.length;
              const textLineHeight = item.lineHeight || defaultLineHeight;
              const size = navList[index].textSize || defaultSize;
              let n = 1 + textIndex;
              let lineHeight;
              lineHeight = bottom + len * textLineHeight - n * textLineHeight;
              return (
                <mesh key={textIndex + '_text' + index}>
                  <Text
                    size={size}
                    hAlign={hAlign}
                    vAlign={vAlign}
                    position={[positionX, lineHeight, 18]}
                    color={color}
                    children={textValue}
                  />
                </mesh>
              );
            })}
            {item.path && (
              <HitArea
                key={index}
                onClick={hadleClick}
                item={navList[index]}
                hAlign={hAlign}
                vAlign={vAlign}
                lineHeight={defaultLineHeight}
                position={[-9, -9.0, 17]}
                children={navList[index].topText}
              />
            )}
            }
          </mesh>
        );
      })}
    </>
  );
}

const Text = ({
  children,
  vAlign,
  hAlign,
  size,
  key,
  color,
  rotation,
  opacity,
  ...props
}) => {
  const font = useLoader(THREE.FontLoader, '/font/FuturaT_Bold.json');
  const textConfig = useMemo(
    () => ({
      font,
      size: size,
      height: -0,
      curveSegments: 32,
      bevelEnabled: false,
      bevelThickness: 0.0,
      bevelSize: 0.0,
      bevelOffset: 0,
      bevelSegments: 1
    }),
    [size, font]
  );
  const mesh = useUpdate(
    self => {
      const size = new THREE.Vector3();
      self.geometry.computeBoundingBox();
      self.geometry.boundingBox.getSize(size);
      self.position.x =
        hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x;
      self.position.y =
        vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y;
    },
    [children]
  );
  return (
    <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry
          needsUpdate={true}
          attach='geometry'
          args={[children, textConfig]}
        />
        <meshLambertMaterial
          transparent={true}
          color={new THREE.Color(color)}
          attach='material'
        />
      </mesh>
    </group>
  );
};

const HitArea = ({ item, vAlign, hAlign, lineHeight, ...props }) => {
  const singleXScale = 3.5;
  const xScale = getMaxTextLength(item.texts) * singleXScale;
  const yScale = lineHeight * item.texts.length;
  const mesh = useUpdate(self => {
    const size = new THREE.Vector3();
    self.geometry.computeBoundingBox();
    self.geometry.boundingBox.getSize(size);
    self.position.x =
      hAlign === 'center'
        ? -size.x / 3
        : hAlign === 'right'
        ? 0
        : -size.x / 2.2;
    self.position.y =
      vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y;
  });
  return (
    <group {...props}>
      <mesh ref={mesh}>
        <planeBufferGeometry attach='geometry' args={[xScale, yScale]} />
        <meshBasicMaterial
          opacity={0.0}
          color='black'
          attach='material'
          transparent={true}
        />
      </mesh>
    </group>
  );
};

const getMaxTextLength = arr => {
  const arrLen = arr.length;
  const strLenArr = [];
  for (let i = 0; arrLen > i; i++) {
    strLenArr.push(arr[i].length);
  }
  return Math.max.apply(null, strLenArr);
};
