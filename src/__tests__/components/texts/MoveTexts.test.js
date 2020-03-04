import React from 'react';
import { render, cleanup } from '@testing-library/react';
import MoveText from '../../../components/texts/MoveTexts';
import { Canvas } from 'react-three-fiber';
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
