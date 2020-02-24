import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import LoadImage from '../helpers/LoadImage';
import * as THREE from 'three';
import ParticleShader from '../shaders/ParticleShader'
import useStore from '../contexts/store';
import { range } from '../helpers/Range';


export const Particle = () => {
  const actions = useStore(state => state.actions);
  const stopMainFrame = useStore(state => state.stopMainFrame);
  const navList = useStore(state => state.navList);
  const navListLength = useStore(state => state.navListLength);
  const ua = useStore(state => state.ua);
  let listIndex = 0;
  let time = 0;
  let theta = 0;
  const clock = new THREE.Clock();
  let [MAX, COLOR] = useMemo(() => {
    if (ua === 'sp') {
      return [4000, [.65, .65, .65]];
    }
    // pc
    return [20000, [1, 1, 1]];
  }, [ua]);
  const bufferAttribute = {
    positions: [],
    endPositions: [],
    alphas: [],
    colors: [],
    times: [],
  }
  const attributes = [];
  const mouse = new THREE.Vector2();
  mouse.x = -0.5;
  mouse.y = 0;
  const mousePos = { x: -1.3, y: 0, px: 0, py: 0, tx: 0, ty: 0 };
  const geometryRef = useRef();
  const materialRef = useRef();

  useEffect(() => {
    const f = async () => {
      const imagePositions = await createImagePositions(COLOR, navList, navListLength);
      const attribute = await createAttributes(imagePositions, MAX);
      await (() => {
        return new Promise(resolve => {
          for (let i = 0; navListLength > i; i++) {
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
          actions.setReady(true);
          actions.setLoading(false);
          actions.setRouter();
          resolve();
        });
      })();
    };
    f();
  }, [bufferAttribute, actions, listIndex, attributes, MAX, COLOR, navList, navListLength]);

  const { camera, invalidate } = useThree();
  let coefficient = 12.0; // first coefficient
  const targetCoefficient = 0.9;
  const mouseTargetCoefficient = -0.5; // z
  useFrame(() => {
    if (stopMainFrame) {
      invalidate();
    }
    coefficient += (targetCoefficient - coefficient) * .08;
    mouse.x += (mouseTargetCoefficient - mouse.x) * .08;
    let delta = clock.getDelta();
    time += delta;
    theta += (mouse.x / 4 - theta) / 10;
    cameraFrame(camera, theta);
    materialFrame(materialRef, time, coefficient, mousePos)
  });


  // listIndexをstate(store)にしてしまうと再描画が起こるのでcollbackで処理
  const scrollCollback = (index) => {
    listIndex = index;
    coefficient = 15.6;
    mouse.x = 2;
    if (geometryRef.current) {
      geometryRef.current.setAttribute('position', bufferAttribute.positions[listIndex]);
      geometryRef.current.setAttribute('aTarget', bufferAttribute.endPositions[listIndex]);
      geometryRef.current.setAttribute('aTime', bufferAttribute.times[listIndex]);
      geometryRef.current.setAttribute('aAlpha', bufferAttribute.alphas[listIndex]);
      geometryRef.current.setAttribute('aColor', bufferAttribute.colors[listIndex]);
    }
  };
  actions.setScrollCollbacks(scrollCollback);

  return (
    <>
      <points>
        <bufferGeometry
          attach="geometry"
          ref={geometryRef}
        >
          <bufferAttribute
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

export const cameraFrame = (camera, theta) => {
  camera.position.x = 20 * Math.sin(theta);
  camera.position.y = 80 * theta + 100;
  camera.position.z = 15 * Math.cos(theta);
  camera.lookAt(new THREE.Vector3());
}

const materialFrame = (materialRef, time, coefficient, mousePos) => {
  materialRef.current.uniforms.uTime.value = time;
  materialRef.current.uniforms.uCoefficient.value = coefficient;
  materialRef.current.needsUpdate = true;
  materialRef.current.uniforms.uMousePosition.value = mousePos;
}


/**
 * createImagePositions
 */
export const createImagePositions = (COLOR, navList, navListLength) => {
  return new Promise(async (resolve) => {
    const canvas = document.createElement("canvas");
    let positions = [];
    for (let i = 0; navListLength > i; i++) {
      const image = await LoadImage(navList[i].src);
      positions[i] = setImagePosition(image, canvas, i, COLOR);
    }
    resolve(positions);
  });
}

export const setImagePosition = (image, canvas, index, COLOR) => {
  let pos = [];
  const scale = 9;
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, image.width, image.height);
  const imageData = data.data;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const num = 4 * (image.width * y + x) + 3;
      const alpha = imageData[num];
      if (alpha !== 0) {
        // const rRate = x / image.width * 1.1;
        // const gRate = y / image.height * .9;
        const color = new THREE.Color();
        color.setRGB(COLOR[0], COLOR[1], COLOR[2]); // white
        const data = {
          x: (x - image.width / 2) / scale,
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
export const createAttributes = (imagePositions, MAX) => {
  return new Promise((resolve) => {
    const count = 3;
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
