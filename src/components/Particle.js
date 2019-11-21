import React, { useMemo, useState, useContext } from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import ImageList from '../config/ImageList';
import AppContext from '../contexts/AppContext';
import LoadImage from '../helpers/LoadImage';
import * as THREE from 'three/src/Three';


let listIndex = 0;
let MAX = 30000;

export default function Particle() {
  const { ua } = useContext(AppContext);
  MAX = useMemo(() => {
    if (ua === 'sp') {
      return 13000;
    }
    return MAX;
  }, []);
  const initImage = async () => {
    const imagePositions = await createImagePositions();
    const attributes = await createAttributes(imagePositions, MAX);
    console.log(attributes)
  }
  initImage();
  return (
    <>
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
function createAttributes(imagePositions, MAX) {
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
      attr.alphas[i] = new Float32Array(MAX * count);
      attr.colors[i] = new Float32Array(MAX * count);
      attr.times[i] = new Float32Array(MAX);
      const datas = imagePositions[i];
      const dataLen = datas.length;
      for (let n = 0; n < MAX; n++) {
        const data = datas[parseInt(dataLen * Math.random())];
        attr.positions[i][n * count] = data.x;
        attr.positions[i][n * count + 1] = 0;
        attr.positions[i][n * count + 2] = data.y;

        attr.endPositions[i][n * count] = range(0, 20);
        attr.endPositions[i][n * count + 1] = range(0, 0);
        attr.endPositions[i][n * count + 2] = range(0, 0);
        
      

      }
    }
    resolve(attr);
  });
}


function range(min, max){
  return min + (max - min) * Math.random();
}