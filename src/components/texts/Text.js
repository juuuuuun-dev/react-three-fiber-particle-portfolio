import React from 'react';
import * as THREE from 'three';
import { useUpdate } from 'react-three-fiber';

const Text = ({
  font,
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
  const textConfig = React.useMemo(
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
export default Text;