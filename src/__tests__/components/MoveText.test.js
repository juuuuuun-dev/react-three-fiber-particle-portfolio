import React from 'react';
import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';
import MoveText from '../../components/MoveText';
import { Canvas } from 'react-three-fiber';
import navList from '../../config/navList';
import * as THREE from 'three';
import 'jest-canvas-mock';
import '@testing-library/jest-dom/extend-expect';
// three
import 'mutationobserver-shim';

afterEach(() => cleanup());

describe('MoveText', () => {
  it('render MoveText', () => {
    const { container } = render(
      <Canvas>
        <MoveText />
      </Canvas>
    );
  });
});
