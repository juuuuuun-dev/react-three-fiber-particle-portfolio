import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import ImageList from '../config/ImageList';
import LoadImage from '../helpers/LoadImage';
import * as THREE from 'three/src/Three';
import ParticleShader from '../shaders/ParticleShader'
import useStore from '../contexts/store'


/**
 * @todo loading
 * @todo contents表示時 text color
 */

export default function Particle() {
  const actions = useStore(state => state.actions);
  
  const navListLength = useStore(state => state.navListLength);
  const ua = useStore(state => state.ua);
  let listIndex = 0;
  let time = 0;
  let theta = 0;
  const clock = new THREE.Clock();
  let MAX = useMemo(() => {
    if (ua === 'sp') {
      return 10000;
    }
    return 30000;
  }, [ ua ]);
  const bufferAttribute = {
    positions: [],
    endPositions: [],
    alphas: [],
    colors: [],
    times: [],
  }
  const attributes = [];
  const mouse = new THREE.Vector2();
  const mousePos = { x: 0, y: 0, px:0, py:0, tx:0, ty:0 };
  const geometryRef = useRef();
  const materialRef = useRef();

  useEffect(() => {
    const f = async () => {
      const imagePositions = await createImagePositions();
      const attribute = await createAttributes(attributes, imagePositions, MAX);
      const imageLen = navListLength;
      for (let i = 0; imageLen > i; i++) {
        bufferAttribute.positions[i] = new THREE.BufferAttribute(attribute.positions[i], 3);
        bufferAttribute.endPositions[i] = new THREE.BufferAttribute(attribute.endPositions[i], 3);
        bufferAttribute.times[i] = new THREE.BufferAttribute(attribute.times[i], 1);
        bufferAttribute.alphas[i] = new THREE.BufferAttribute(attribute.alphas[i], 1);
        bufferAttribute.colors[i] = new THREE.BufferAttribute(attribute.colors[i], 3);
      }
      geometryRef.current.setAttribute('position', bufferAttribute.positions[listIndex]);
      geometryRef.current.setAttribute('position', bufferAttribute.positions[listIndex]);
      geometryRef.current.setAttribute('aTarget', bufferAttribute.endPositions[listIndex]);
      geometryRef.current.setAttribute('aAlpha', bufferAttribute.alphas[listIndex]);
      geometryRef.current.setAttribute('aTime', bufferAttribute.times[listIndex]);
      geometryRef.current.setAttribute('aColor', bufferAttribute.colors[listIndex]);
    };
    f();
  }, [ bufferAttribute, listIndex, attributes, MAX, navListLength ]);
  
  const { camera } = useThree();
  let coefficient = 0.6;
  const targetCoefficient = 0.1;
  // @todo スマホは角度固定
  useFrame(() => {
    coefficient += (targetCoefficient - coefficient) * .1;
    let delta = clock.getDelta();
    time += delta;
    theta += (mouse.x / 4 - theta) / 10;
    camera.position.z = 15 * Math.cos(theta);
    camera.position.x = 20 * Math.sin(theta);
    camera.position.y = 80 * theta + 100;
    camera.lookAt(new THREE.Vector3());
    
    // mousePos.x += mousePos.px * .01;
    // mousePos.y += (targetMousePos.y - mousePos.y) * .01;
    // particleRef.current.geometry.attributes.position.needsUpdate = true;
    
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uCoefficient.value = coefficient;
    materialRef.current.needsUpdate = true;
    materialRef.current.uniforms.uMousePosition.value = mousePos;
    
    // updatePositin(mousePos, particleRef.current.geometry.attributes);
    // particleRef.current.material.uniforms.uMousePosition.value = mousePos;

  });
  // listIndexをstate(store)にしてしまうと再描画が起こるのでcollbackで処理
  const scrollCollback = (index) => {
    listIndex = index;
    coefficient = 15.6;
    if (geometryRef.current) {
      geometryRef.current.setAttribute('position', bufferAttribute.positions[listIndex]);
      geometryRef.current.setAttribute('aTarget', bufferAttribute.endPositions[listIndex]);
      geometryRef.current.setAttribute('aTime', bufferAttribute.times[listIndex]);
      geometryRef.current.setAttribute('aAlpha', bufferAttribute.alphas[listIndex]);
      geometryRef.current.setAttribute('aColor', bufferAttribute.colors[listIndex]);
    }
  };
  actions.setScrollCollbacks(scrollCollback);
  
  document.addEventListener('mousemove', (event) => {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = ( event.clientY / window.innerHeight ) * 2 - 1;
    mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mousePos.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    mousePos.x = mousePos.x * 2;
    mousePos.y = mousePos.y * 2;
  });

  return (
    <>
    <points>
      <bufferGeometry
        attach="geometry"
        ref={geometryRef}
      >
        <bufferAttribute
          needsUpdate={true}
          attachObject={['attributes', 'position']}
          count={MAX}
          array={new Float32Array(MAX * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        attach="material"
        name="material"
        args={[ParticleShader]}
      />
    </points>
    </>
  )
}


/**
 * createImagePositions
 */
function createImagePositions() {
  return new Promise(async (resolve) => {
    const canvas = document.createElement("canvas");
    let positions = [];
    const listLen = ImageList.length;
    for (let i = 0; listLen > i; i++) {
      const image = await LoadImage(ImageList[i].src);
      positions[i] = setImagePosition(image, canvas, i);
    }
    resolve(positions);
  });
}

function setImagePosition(image, canvas, index) {
  let pos = [];
  const scale = 10;
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, image.width, image.height);
  const imageData = data.data;
  
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++ ) {
      const num = 4 * (image.width * y + x) + 3;
      const alpha = imageData[num];
      if (alpha !== 0) {
        const rRate = x / image.width * 1.3;
        const gRate = y / image.height * .9;
        const color = new THREE.Color();
        // color.setRGB(rRate, gRate, 1);
        color.setRGB(rRate, .8, .85);
        const data = {
          x: (x - image.width / 2 + 9 * Math.random()) / scale,
          y: (y - image.height / 2) / scale,
          alpha: alpha / 255,
          color,
        }
        pos.push(data);
      }
    }
  }
  return pos;
}

/**
 * createAttributes
 */
function createAttributes(attributes, imagePositions, MAX) {
  return new Promise((resolve) => {
    const count = 3;
    // let attr = attributes;
    let attr = {
      positions: [],
      endPositions: [],
      alphas: [],
      colors: [],
      times: [],
    };
    let imageLen = imagePositions.length;
    
    for (let i = 0; imageLen > i; i++) {
      attr.positions[i] = new Float32Array(MAX * count);
      attr.endPositions[i] = new Float32Array(MAX * count);
      attr.alphas[i] = new Float32Array(MAX);
      attr.colors[i] = new Float32Array(MAX * count);
      attr.times[i] = new Float32Array(MAX);
      const datas = imagePositions[i];
      const datasLen = datas.length;
      for (let n = 0; n < MAX; n++) {
        const data = datas[parseInt(datasLen * Math.random())];
        attr.positions[i][n * count] = data.x;
        attr.positions[i][n * count + 1] = 0;
        attr.positions[i][n * count + 2] = data.y;

        attr.endPositions[i][n * count] = range(0, 40);
        attr.endPositions[i][n * count + 1] = range(0, 40);
        attr.endPositions[i][n * count + 2] = range(0, 0);

        attr.times[i][n] = count * Math.random();
        attr.alphas[i][n] = Math.random();
        attr.colors[i][n * count] = data.color.r;
        attr.colors[i][n * count + 1] = data.color.g;
        attr.colors[i][n * count + 2] = data.color.b;
      }
    }
    resolve(attr);
  });
}

function range(min, max){
  return min + (max - min) * Math.random();
}