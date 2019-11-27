import React, { useRef, useMemo, useState, useEffect, useContext } from 'react';
import { useRender, useThree } from 'react-three-fiber';
import ImageList from '../config/ImageList';
import IndexContext from '../contexts/IndexContext';
import LoadImage from '../helpers/LoadImage';
import * as THREE from 'three/src/Three';
import ParticleShader from '../shaders/ParticleShader'

let listIndex = 0;
let time = 0;
let theta = 0;
export default function Particle() {
  const ua = useContext(IndexContext);
  const clock = new THREE.Clock();
  let MAX = useMemo(() => {
    if (ua === 'sp') {
      return 10000;
    }
    return 30000;
  }, [ ua ]);
  console.log('start');
  console.log({ua, MAX})
  const [ bufferAttribute ] = useState(() => {
    return {
      positions: [],
      endPositions: [],
      alphas: [],
      colors: [],
      times: [],
    };
  });
  const [ attributes ] = useState(() => {
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
      const imageLen = ImageList.length;
      for (let i = 0; imageLen > i; i++) {
        bufferAttribute.positions[i] = new THREE.BufferAttribute(attribute.positions[i], 3);
        bufferAttribute.endPositions[i] = new THREE.BufferAttribute(attribute.endPositions[i], 3);
        bufferAttribute.times[i] = new THREE.BufferAttribute(attribute.times[i], 1);
        bufferAttribute.alphas[i] = new THREE.BufferAttribute(attribute.alphas[i], 1);
        bufferAttribute.colors[i] = new THREE.BufferAttribute(attribute.colors[i], 3);
      }
      particleRef.current.geometry.setAttribute('position', bufferAttribute.positions[listIndex]);
      particleRef.current.geometry.setAttribute('aTarget', bufferAttribute.endPositions[listIndex]);
      particleRef.current.geometry.setAttribute('aAlpha', bufferAttribute.alphas[listIndex]);
      particleRef.current.geometry.setAttribute('aTime', bufferAttribute.times[listIndex]);
      particleRef.current.geometry.setAttribute('aColor', bufferAttribute.colors[listIndex]);
    };
    f();
  }, [ bufferAttribute, attributes, MAX ]);
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
    camera.position.y = 80 * theta + 100;
    camera.lookAt(new THREE.Vector3())

    // mousePos.x += mousePos.px * .01;
    // mousePos.y += (targetMousePos.y - mousePos.y) * .01;
    particleRef.current.geometry.attributes.position.needsUpdate = true;
    particleRef.current.material.uniforms.uTime.value = time;
    particleRef.current.material.needsUpdate = true;
    

    updatePositin(mousePos, particleRef.current.geometry.attributes);
    particleRef.current.material.uniforms.uMousePosition.value = mousePos;

  
  });

  window.addEventListener('click', function(e){
    listIndex += 1;
    if (ImageList.length <= listIndex) {
      listIndex = 0;
    }

    particleRef.current.geometry.setAttribute('position', bufferAttribute.positions[listIndex]);
    // @todo こいつどうするか
    // particleRef.current.geometry.setAttribute('aTarget', new THREE.BufferAttribute(attributes.endPositions[listIndex], 3));
    particleRef.current.geometry.setAttribute('aTarget', bufferAttribute.endPositions[listIndex]);

    particleRef.current.geometry.setAttribute('aTime', bufferAttribute.times[listIndex]);
    particleRef.current.geometry.setAttribute('aAlpha', bufferAttribute.alphas[listIndex]);
    particleRef.current.geometry.setAttribute('aColor', bufferAttribute.colors[listIndex]);
  });
  const maxMouseXPos = 4;
  const maxMouseYPos = 10;
  document.addEventListener('mousemove', (event) => {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = ( event.clientY / window.innerHeight ) * 2 - 1;
    // mouse.x = mouse.x * 4;

    console.log(mouse.x) 

    mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mousePos.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    mousePos.x = mousePos.x * 2;
    mousePos.y = mousePos.y * 2;

    // mousePos.x = event.clientX;
    // mousePos.y = event.clientY;
    // mousePos.px = mousePos.x / window.innerWidth;
    // mousePos.py = 1.0 - mousePos.y / window.innerHeight;
    
    // mousePos.x = event.clientX - (window.innerWidth / 2);
    // mousePos.y = event.clientY - (window.innerHeight / 2);
    // mousePos.x = mousePos.x > maxMouseXPos ? maxMouseXPos : mousePos.x;
    // mousePos.x = mousePos.x < -maxMouseXPos ? -maxMouseXPos : mousePos.x;
    // mousePos.y = mousePos.y > maxMouseYPos ? maxMouseYPos : mousePos.y;
    // mousePos.y = mousePos.y < -maxMouseYPos ? -maxMouseYPos : mousePos.y;
    // targetMousePos.x = mousePos.px;
    // targetMousePos.y = mousePos.py;
    console.log(mousePos)
  });


  function updatePositin(mousePos, index) {
    const count = 3;
    // console.log(bufferAttribute.endPositions[listIndex])
    for (var i = 0; i < MAX; i++) {
      if (i % 2 !== 0) continue;

      // attr
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
    <points ref={particleRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          needsUpdate={true}
          attachObject={['attributes', 'position']}
          count={new Float32Array(MAX)}
          array={new Float32Array(MAX * 3)}
          itemSize={3}
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
      const image = await LoadImage(ImageList[i].src);
      positions[i] = setImagePosition(image, canvas);
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