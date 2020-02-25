import React from 'react';
import { render, cleanup, getByTestId } from '@testing-library/react';
import {
  Particle,
  cameraFrame,
  materialFrame,
  createImagePositions,
  setImagePosition,
  createAttributes,
  setBufferAttributes,
  setGeometory,
  changeAttribute,
  getUaParticleData
} from '../../components/Particle';
import { Canvas } from 'react-three-fiber';
import navList from '../../config/navList';
import * as THREE from 'three';
import ParticleShader from '../../shaders/ParticleShader';
import config from '../../config/particle';

// import img from '../../images/smile.png'
import LoadImage from '../../helpers/LoadImage';
import 'jest-canvas-mock';
import '@testing-library/jest-dom/extend-expect';
// three
import 'mutationobserver-shim';

// jest.mock('../../images/smile.png');
// global.Promise = jest.requireActual('promise');
let canvas;
const img = new Image();
img.src = 'https://placekitten.com/100/50';
img.width = 100;
img.height = 50;
beforeEach(() => {
  canvas = document.createElement('canvas');
});
describe('Particle', () => {
  it('renders Particle', async () => {
    const { container } = render(
      <Canvas>
        <Particle />
      </Canvas>
    );
    console.log(container.getInstance());
    const COLOR = [1, 1, 1];
    const navListLength = navList.length;
    const imagePositions = createImagePositions(COLOR, navList, navListLength);
    expect(imagePositions).toBeDefined();
    const position = setImagePosition(img, canvas, 1, COLOR);
    expect(position).toBeDefined();
  });
  it('createAttributes', async () => {
    const MAX = 10;
    const positions = makeEmptyPosition(MAX);
    const attribute = await createAttributes(positions, MAX / 3);
    expect(attribute.positions).toBeDefined();
    expect(attribute.endPositions).toBeDefined();
    expect(attribute.times).toBeDefined();
    expect(attribute.alphas).toBeDefined();
    expect(attribute.colors).toBeDefined();
  });
  it('cameraFrame', () => {
    const camera = new THREE.PerspectiveCamera(45);
    const theta = 1;
    expect(camera.position.x).toBe(0);
    expect(camera.position.y).toBe(0);
    expect(camera.position.z).toBe(0);
    cameraFrame(camera, theta);
    expect(camera.position.x).not.toBe(0);
    expect(camera.position.y).not.toBe(0);
    expect(camera.position.z).not.toBe(0);
  });
  it('materialFrame', () => {
    const materialRef = {
      current: {
        uniforms: ParticleShader.uniforms
      }
    };
    const time = 10;
    const coefficient = 10;
    const mousePos = { x: 1, y: 0 };
    expect(materialRef.current.uniforms).toBe(ParticleShader.uniforms);
    materialFrame(materialRef, time, coefficient, mousePos);
    expect(materialRef.current.uniforms.uTime.value).toBe(time);
    expect(materialRef.current.uniforms.uCoefficient.value).toBe(coefficient);
    expect(materialRef.current.uniforms.uMousePosition.value).toBe(mousePos);
  });
  it('setBufferAttributes', async () => {
    const length = 1;
    const bufferAttribute = {
      positions: [],
      endPositions: [],
      alphas: [],
      colors: [],
      times: []
    };
    const MAX = 10;
    const positions = makeEmptyPosition(MAX);
    const attribute = await createAttributes(positions, MAX / 3);
    await setBufferAttributes(bufferAttribute, attribute, length);

    const i = length - 1;
    expect(bufferAttribute.positions[i]).toMatchObject(
      new THREE.BufferAttribute(attribute.positions[i], 3)
    );
    expect(bufferAttribute.endPositions[i]).toMatchObject(
      new THREE.BufferAttribute(attribute.endPositions[i], 3)
    );
    expect(bufferAttribute.times[i]).toMatchObject(
      new THREE.BufferAttribute(attribute.times[i], 1)
    );
    expect(bufferAttribute.colors[i]).toMatchObject(
      new THREE.BufferAttribute(attribute.colors[i], 3)
    );
  });
  it('setGeometory', async () => {
    const geometryRef = {
      current: new THREE.BufferGeometry()
    };
    const length = 1;
    const bufferAttribute = {
      positions: [],
      endPositions: [],
      alphas: [],
      colors: [],
      times: []
    };
    const listIndex = 0;
    const MAX = 10;
    const positions = makeEmptyPosition(MAX);
    const attribute = await createAttributes(positions, MAX / 3);
    await setBufferAttributes(bufferAttribute, attribute, length);
    await setGeometory(geometryRef, bufferAttribute, listIndex);
    expect(geometryRef.current.attributes.position).toBe(
      bufferAttribute.positions[listIndex]
    );
    expect(geometryRef.current.attributes.aTarget).toBe(
      bufferAttribute.endPositions[listIndex]
    );
    expect(geometryRef.current.attributes.aAlpha).toBe(
      bufferAttribute.alphas[listIndex]
    );
    expect(geometryRef.current.attributes.aTime).toBe(
      bufferAttribute.times[listIndex]
    );
    expect(geometryRef.current.attributes.aColor).toBe(
      bufferAttribute.colors[listIndex]
    );
  });
  it('changeAttribute', async () => {
    const index = 1;
    const length = 2;
    const geometryRef = {
      current: new THREE.BufferGeometry()
    };
    const bufferAttribute = {
      positions: [],
      endPositions: [],
      alphas: [],
      colors: [],
      times: []
    };
    const listIndex = 0;
    const MAX = 10;
    const positions = makeEmptyPosition(MAX);
    const attribute = await createAttributes(positions, MAX / 3);
    await setBufferAttributes(bufferAttribute, attribute, length);
    await setGeometory(geometryRef, bufferAttribute, listIndex);
    changeAttribute(index, geometryRef, bufferAttribute);
    expect(geometryRef.current.attributes.position).toBe(
      bufferAttribute.positions[index]
    );
    expect(geometryRef.current.attributes.aTarget).toBe(
      bufferAttribute.endPositions[index]
    );
    expect(geometryRef.current.attributes.aTime).toBe(
      bufferAttribute.times[index]
    );
    expect(geometryRef.current.attributes.aAlpha).toBe(
      bufferAttribute.alphas[index]
    );
    expect(geometryRef.current.attributes.aColor).toBe(
      bufferAttribute.colors[index]
    );
  });
  it('pc getUaParticleData', () => {
    const ua = 'pc';
    const [MAX, COLOR] = getUaParticleData(ua);
    expect(MAX).toBe(config.pcParticleNumber);
    expect(COLOR).toBe(config.pcParticleColor);
  });
  it('sp getUaParticleData', () => {
    const ua = 'sp';
    const [MAX, COLOR] = getUaParticleData(ua);
    expect(MAX).toBe(config.spParticleNumber);
    expect(COLOR).toBe(config.spParticleColor);
  });
  it('should be callable', () => {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 1, 2);
    expect(ctx.drawImage).toBeCalled();
  });
});

const makeEmptyPosition = MAX => {
  let positions = [];
  const position = [
    {
      x: 1,
      y: 1,
      alpha: 1,
      color: { r: 1, g: 1, b: 1 }
    }
  ];
  for (let i = 0; i <= MAX; i++) {
    positions.push(position);
  }
  return positions;
};
