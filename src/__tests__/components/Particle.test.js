import React from 'react';
import { render, cleanup, getByTestId } from '@testing-library/react'
import { Particle, cameraFrame, createImagePositions, setImagePosition, createAttributes } from '../../components/Particle';
import { Canvas } from 'react-three-fiber';
import navList from '../../config/navList'
import * as THREE from 'three';

// import img from '../../images/smile.png'
import LoadImage from '../../helpers/LoadImage'
import 'jest-canvas-mock';
import "@testing-library/jest-dom/extend-expect";
// three
import "mutationobserver-shim";

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
describe("Particle", () => {
  it('renders Particle', async () => {
    const { container } = render(<Canvas><Particle /></Canvas>);
    const COLOR = [1, 1, 1];
    const navListLength = navList.length;
    const imagePositions = createImagePositions(COLOR, navList, navListLength);
    expect(imagePositions).toBeDefined();
    const position = setImagePosition(img, canvas, 1, COLOR);
    expect(position).toBeDefined();
  });
  it('createAttributes', async () => {
    const MAX = 10;
    let positions = [];
    const position = [{
      x: 1,
      y: 1,
      alpha: 1,
      color: { r: 1, g: 1, b: 1 }
    }]
    for (let i = 0; i <= MAX; i++) {
      positions.push(position);
    }
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
  it('should be callable', () => {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 1, 2);
    expect(ctx.drawImage).toBeCalled();
  });

});
