import React, { useRef, useMemo, useState, useEffect, useContext } from 'react';
import { useRender, useThree } from 'react-three-fiber';
import ImageList from '../config/ImageList';
import IndexContext from '../contexts/IndexContext';
import LoadImage from '../helpers/LoadImage';
import * as THREE from 'three/src/Three';
import ParticleShader from '../shaders/ParticleShader'
import { getDevice } from '../helpers/UserAgent';

let listIndex = 0;
let time = 0;
let theta = 0;
export default function Particle() {
  // const ua = useContext(IndexContext);
  const ua = getDevice();
  const clock = new THREE.Clock();
  console.log('start');
  console.log(ua)
  let MAX = useMemo(() => {
    if (ua === 'sp') {
      return 10000;
    }
    return 30000;
  }, [ ua ]);
  const [attributes, setAttribute] = useState(() => {
    const count = 3;
    let attr = {
      positions: [],
      endPositions: [],
      alphas: [],
      colors: [],
      times: [],
    };
    let imageLen = ImageList.length;
    for (let i = 0; imageLen > i; i++) {
      attr.positions[i] = new Float32Array(MAX * count);
      attr.endPositions[i] = new Float32Array(MAX * count);
      attr.alphas[i] = new Float32Array(MAX);
      attr.colors[i] = new Float32Array(MAX * count);
      attr.times[i] = new Float32Array(MAX);
    }
    return attr;
  });

  useEffect(() => {
    const f = async () => {
      const imagePositions = await createImagePositions();
      const attribute = await createAttributes(attributes, imagePositions, MAX);
      setAttribute(attribute);
      // console.log(attributes.positions[listIndex]);
    };
    f();
  }, [ attributes, MAX ]);
  console.log(MAX)
  const mouse = new THREE.Vector2();
  const mousePos = { x: 0, y: 0, px:0, py:0, tx:0, ty:0 };
  const targetMousePos = { x: 0, y: 0 };
  const particleRef = useRef();
  const { camera } = useThree();
  useRender(() => {
    // camera.position.y += 0.01;
    // camera.position.z += 0.01;
    let delta = clock.getDelta();
    time += delta;
    theta += (mouse.x / 3 - theta) / 10;
    camera.position.z = 15 * Math.cos(theta);
    camera.position.x = 20 * Math.sin(theta);
    camera.lookAt(new THREE.Vector3())
    particleRef.current.geometry.attributes.position.needsUpdate = true;
    particleRef.current.material.uniforms.uTime.value = time;
    particleRef.current.material.needsUpdate = true;
    
    // particleRef.current.geometry.setAttribute('aTarget', new THREE.BufferAttribute(attributes.endPositions[listIndex], 3));
    // particleRef.current.geometry.setAttribute('aTime', new THREE.BufferAttribute(attributes.times[listIndex], 1));
    // particleRef.current.geometry.setAttribute('aAlpha', new THREE.BufferAttribute(attributes.alphas[listIndex], 1));
    // particleRef.current.geometry.setAttribute('aColor', new THREE.BufferAttribute(attributes.colors[listIndex], 3));
    mousePos.x += (targetMousePos.x - mousePos.x) * .1;
    mousePos.y += (targetMousePos.y - mousePos.y) * .1;
    updatePositin(mousePos, particleRef.current.geometry.attributes);
  });

  window.addEventListener('click', function(e){
    listIndex += 1;
    if (ImageList.length <= listIndex) {
      listIndex = 0;
    }
    console.log(listIndex);
    particleRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(attributes.positions[listIndex], 3));
    // particleRef.current.geometry.setAttribute('aTarget', attributes.endPositions[listIndex]);
    particleRef.current.geometry.setAttribute('aTarget', new THREE.BufferAttribute(attributes.endPositions[listIndex], 3));
    // @todo newじゃなくて固定
    particleRef.current.geometry.setAttribute('aTime', new THREE.BufferAttribute(attributes.times[listIndex], 1));
    particleRef.current.geometry.setAttribute('aAlpha', new THREE.BufferAttribute(attributes.alphas[listIndex], 1));
    particleRef.current.geometry.setAttribute('aColor', new THREE.BufferAttribute(attributes.colors[listIndex], 3));
  });
  const maxMouseXPos = 4;
  const maxMouseYPos = 10;
  document.addEventListener('mousemove', (event) => {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
    mousePos.px = mousePos.x / window.innerWidth;
    mousePos.py = 1.0 - mousePos.y / window.innerHeight;
    
    mousePos.tx = event.clientX - (window.innerWidth / 2);
    mousePos.ty = event.clientY - (window.innerHeight / 2);
    mousePos.tx = mousePos.tx > maxMouseXPos ? maxMouseXPos : mousePos.tx;
    mousePos.tx = mousePos.tx < -maxMouseXPos ? -maxMouseXPos : mousePos.tx;
    mousePos.ty = mousePos.ty > maxMouseYPos ? maxMouseYPos : mousePos.ty;
    mousePos.ty = mousePos.ty < -maxMouseYPos ? -maxMouseYPos : mousePos.ty;
    targetMousePos.x = mousePos.px;
    targetMousePos.y = mousePos.py;
  });


function updatePositin(mousePos, index) {
  const count = 3;
  // スマホは除外
  for (var i = 0; i < MAX; i++) {
    if (i % 2 !== 0) continue;
    let targetX = attributes.endPositions[listIndex][i * count] - (mousePos.tx / 2);
    targetX = targetX < 80 ? targetX : Math.random() * 80;
    targetX = targetX > -60 ? targetX : Math.random() * -60;
    let targetY = attributes.endPositions[listIndex][i * count + 1] + (mousePos.ty / 2);
    targetY = targetY < 200 ? targetY : Math.random() * 200;
    targetY = targetY > -200 ? targetY : Math.random() * -200;
    attributes.endPositions[listIndex][i * count] = targetX;
    attributes.endPositions[listIndex][i * count + 1] = targetY;
    attributes.endPositions[listIndex][i * count + 2] = range(0, 0);
  }
}

  return (
    <>
    <points ref={particleRef} onUpdate={self => console.log('props have been updated')}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          needsUpdate={true}
          attachObject={['attributes', 'position']}
          count={attributes.positions[listIndex].length / 3}
          array={attributes.positions[listIndex]} itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
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
      await LoadImage(ImageList[i].src)
        .then(image => {
          positions[i] = setImagePosition(image, canvas);
        })
    }
    resolve(positions);
  });
}

function setImagePosition(image, canvas) {
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
        const rRate = x / image.width * .9;
        const gRate = y / image.height * .2;
        const color = new THREE.Color();
        color.setRGB(rRate, gRate, 1);
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
    let attr = attributes;
    let imageLen = imagePositions.length;
    for (let i = 0; imageLen > i; i++) {
      
      const datas = imagePositions[i];
      const datasLen = datas.length;
      for (let n = 0; n < MAX; n++) {
        const data = datas[parseInt(datasLen * Math.random())];
        attr.positions[i][n * count] = data.x;
        attr.positions[i][n * count + 1] = 0;
        attr.positions[i][n * count + 2] = data.y;

        attr.endPositions[i][n * count] = range(0, 40);
        attr.endPositions[i][n * count + 1] = range(0, 20);
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