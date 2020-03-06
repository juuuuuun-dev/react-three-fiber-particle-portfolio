import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Text from '../../../components/texts/Text';
import { Canvas } from 'react-three-fiber';
import 'jest-canvas-mock';
import '@testing-library/jest-dom/extend-expect';
import 'mutationobserver-shim';

afterEach(() => cleanup());

describe('Text', () => {
  it('render MoveText', () => {
    const { container } = render(
      <Canvas>
        <Text />
      </Canvas>
    );
  });
});