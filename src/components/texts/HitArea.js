import React from 'react';
import * as THREE from 'three';
import { maxTextlength } from '../../helpers/Num';
import { useUpdate } from 'react-three-fiber';

const HitArea = ({ item, vAlign, hAlign, lineHeight, ...props }) => {
  const singleXScale = 3.5;
  const xScale = maxTextlength(item.texts) * singleXScale;
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

export default HitArea;