import React from 'react';
import { render, getByTestId } from '@testing-library/react'
import Main from '../../pages/Main';
import "@testing-library/jest-dom/extend-expect";
// three
import "mutationobserver-shim";


describe("page Main", () => {
  it('renders Main', () => {
    const { container } = render(<Main />);
    const canvas = getByTestId(container, 'canvas');
    expect(canvas).toBeDefined();
  });
});